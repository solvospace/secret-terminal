import crypto from "node:crypto";
import TokenService from "../../common/services/token.service.js";
import AccountVerificationMail from "./emails/account-verification.mail.js";
import PasswordResetMail from "./emails/password-reset-mail.js";
import HasherService from "@/common/services/hasher.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import {
    Injectable,
    HttpStatus,
    ConflictException,
    UnprocessableEntityException,
    NotFoundException,
    UnauthorizedException,
    BadRequestException,
    Logger,
    InternalServerErrorException,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { Mailer } from "@nestjs/mail";
import { NodeResponse } from "@nestjs/platform-node";
import type { SignUpProperties, SignInProperties } from "./auth.types.js";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
};

@Injectable()
export default class AuthenticationService {
    private readonly logger = new Logger(AuthenticationService.name);
    constructor(
        private readonly prisma: PrismaService,
        private readonly mailer: Mailer,
        private readonly adapterHost: HttpAdapterHost,
        private readonly hasher: HasherService,
        private readonly tokenService: TokenService,
    ) {}

    async signUp(properties: SignUpProperties) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: properties.email },
        });

        if (existingUser) {
            throw new ConflictException("User already exists.");
        }

        const verificationCode = this.generateCode();
        const hashedPassword = await this.hasher.hash(properties.password);

        const user = await this.prisma.user.create({
            data: {
                name: properties.name,
                email: properties.email,
                password: hashedPassword,
                verificationCode,
            },
        });

        if (user.id) {
            await this.sendAccountVerificationEmail(user.email, verificationCode);
        }

        return {
            data: { verified: user.verified },
            message: "Verify your account. A verification code has been sent to you.",
            status: HttpStatus.CREATED,
        };
    }

    async signIn(properties: SignInProperties) {
        if (!properties.email) {
            throw new UnprocessableEntityException("Email is required.");
        }

        if (!properties.password) {
            throw new UnprocessableEntityException("Password is required.");
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { email: properties.email },
        });

        if (!foundUser) {
            throw new UnprocessableEntityException("Incorrect email or password.");
        }

        const isMatch = await this.hasher.verify(properties.password, foundUser.password);

        if (!isMatch) {
            throw new UnprocessableEntityException("Incorrect email or password.");
        }

        if (!foundUser.verified) {
            return this.sendVerificationCode(foundUser.email, foundUser.id);
        }

        const tokens = await this.manageTokens(foundUser.id);

        return {
            tokens,
            status: HttpStatus.OK,
            data: { verified: foundUser.verified },
            message: "Welcome back! Glad to see you again.",
        };
    }

    async sendVerificationCode(email: string, userId?: string) {
        let localUserId = userId;

        if (!localUserId) {
            const foundUser = await this.prisma.user.findUnique({
                where: { email },
                select: { id: true },
            });

            if (!foundUser) {
                throw new UnprocessableEntityException("Incorrect email.");
            }

            localUserId = foundUser.id;
        }

        const verificationCode = this.generateCode();
        const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

        await this.prisma.user.update({
            where: { id: localUserId },
            data: {
                verificationCode,
                verificationCodeExpiresAt,
            },
        });

        await this.sendAccountVerificationEmail(email, verificationCode);

        return {
            tokens: null,
            data: { verified: false },
            message: "A verification code has been sent to your email.",
            status: HttpStatus.OK,
        };
    }

    async verifyAccount({ email, code }: Record<string, string>) {
        if (!email) {
            throw new UnprocessableEntityException("Email is required.");
        }

        if (!code) {
            throw new UnprocessableEntityException("Verification code is required.");
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!foundUser) {
            throw new NotFoundException("User doesn't exist.");
        }

        if (foundUser.verified) {
            throw new ConflictException("Account is already verified.");
        }

        if (foundUser.verificationCode !== code) {
            throw new UnprocessableEntityException("Invalid verification code.");
        }

        if (!foundUser.verificationCodeExpiresAt || new Date() > foundUser.verificationCodeExpiresAt) {
            throw new UnauthorizedException("Verification code has expired.");
        }

        await this.prisma.user.update({
            where: { id: foundUser.id },
            data: {
                verified: true,
                verificationCode: null,
                verificationCodeExpiresAt: null,
            },
        });

        const tokens = await this.manageTokens(foundUser.id);

        return {
            tokens,
            status: HttpStatus.OK,
            message: "Account verified successfully.",
        };
    }

    async forgotPassword(email: string) {
        if (!email) {
            throw new UnprocessableEntityException("Email is required.");
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { email },
        });

        const message = "If the email exists, a reset code has been sent.";

        if (!foundUser) {
            return {
                message,
                status: HttpStatus.OK,
            };
        }

        const resetCode = this.generateCode();
        const hashedCode = await this.hasher.hash(resetCode);

        await this.prisma.$transaction(async (tx) => {
            await tx.resetCode.deleteMany({
                where: { userId: foundUser.id },
            });

            await tx.resetCode.create({
                data: {
                    userId: foundUser.id,
                    code: hashedCode,
                },
            });
        });

        await this.sendPasswordResetEmail(email, resetCode);

        return {
            message,
            status: HttpStatus.OK,
        };
    }

    async verifyResetCode(properties: Record<string, string>) {
        const { resetCode, email } = properties;

        if (!resetCode) {
            throw new UnprocessableEntityException("Reset code is required.");
        }

        if (!email) {
            throw new UnprocessableEntityException("Email is required.");
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!foundUser) {
            throw new NotFoundException("Invalid reset request.");
        }

        const resetCodeEntry = await this.prisma.resetCode.findFirst({
            where: { userId: foundUser.id },
        });

        if (!resetCodeEntry) {
            throw new UnprocessableEntityException("Invalid reset code.");
        }

        if (new Date() >= resetCodeEntry.expiresAt) {
            throw new UnauthorizedException("Reset code expired.");
        }

        const isCodeMatched = await this.hasher.verify(resetCode, resetCodeEntry.code);

        if (!isCodeMatched) {
            throw new UnauthorizedException("Invalid reset code.");
        }

        await this.prisma.resetCode.delete({
            where: { id: resetCodeEntry.id },
        });

        const updatePasswordToken = this.tokenService.generate("accessToken", {
            userId: foundUser.id,
            purpose: process.env.CPT_PURPOSE,
        });

        return {
            message: "Verified!",
            token: updatePasswordToken,
            status: HttpStatus.OK,
        };
    }

    async changePassword(properties: Record<string, string>) {
        const { userId, password } = properties;

        if (!password) {
            throw new UnprocessableEntityException("Password is required.");
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!foundUser) {
            throw new NotFoundException("User doesn't exist.");
        }

        const hashedPassword = await this.hasher.hash(password);

        await this.prisma.user.update({
            where: { id: foundUser.id },
            data: { password: hashedPassword },
        });

        return {
            message: "Password updated successfully.",
            status: HttpStatus.OK,
        };
    }

    async refreshToken(token: string) {
        if (!token) {
            throw new UnauthorizedException("Refresh token is missing.");
        }

        const decoded = this.tokenService.verify("refreshToken", token);

        if (
            typeof decoded !== "object" ||
            decoded === null ||
            "error" in decoded ||
            !("payload" in decoded) ||
            typeof decoded.payload !== "object" ||
            decoded.payload === null ||
            !("userId" in decoded.payload) ||
            typeof decoded.payload.userId !== "string"
        ) {
            throw new UnauthorizedException("Invalid or expired refresh token.");
        }

        const user = await this.prisma.user.findUnique({
            where: { id: decoded.payload.userId },
        });

        if (!user) {
            throw new NotFoundException("User not found.");
        }

        const tokens = await this.manageTokens(user.id, token);

        return {
            tokens,
            message: "Done!",
            status: HttpStatus.OK,
        };
    }

    async signOut(token: string) {
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: { token },
        });

        if (!storedToken) {
            throw new UnauthorizedException("Please clear this site's cookies and sign in again.");
        }

        await this.prisma.refreshToken.delete({
            where: { id: storedToken.id },
        });

        return {
            message: "You have been logged out. Have a great day.",
            status: HttpStatus.OK,
        };
    }

    async manageTokens(userId: string, token?: string) {
        if (!userId) {
            throw new BadRequestException("User ID is missing.");
        }

        const tokenPayload = { userId };

        const newAccessToken = this.tokenService.generate("accessToken", tokenPayload);
        const newRefreshToken = this.tokenService.generate("refreshToken", tokenPayload);

        await this.prisma.$transaction(async (tx) => {
            if (token) {
                await tx.refreshToken.deleteMany({
                    where: {
                        token,
                        userId,
                    },
                });
            }

            await tx.refreshToken.create({
                data: {
                    userId,
                    token: newRefreshToken,
                },
            });
        });

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        };
    }

    private generateCode(length = 6) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length);

        return crypto.randomInt(min, max).toString();
    }

    private async sendPasswordResetEmail(email: string, resetCode: string): Promise<void> {
        try {
            await this.mailer.send(PasswordResetMail, {
                to: email,
                data: {
                    toEmailAddress: email,
                    resetCode,
                },
            });
        } catch (error: unknown) {
            this.handleMailError(error);
        }
    }

    private async sendAccountVerificationEmail(email: string, verificationCode: string): Promise<void> {
        try {
            await this.mailer.send(AccountVerificationMail, {
                to: email,
                data: {
                    toEmailAddress: email,
                    verificationCode,
                },
            });
        } catch (error) {
            this.handleMailError(error);
        }
    }

    private handleMailError(error: unknown) {
        this.logger.error("Failed to send mail", (error instanceof Error && error.stack) ?? String(error));
        throw new InternalServerErrorException((error instanceof Error && error.message) ?? "Unable to send mail");
    }

    setAuthCookies(response: NodeResponse, tokens: { accessToken: string; refreshToken: string }) {
        this.adapterHost.httpAdapter.setCookie(response, "accessToken", tokens.accessToken, {
            ...cookieOptions,
            maxAge: Number(process.env.COOKIE_AT_AGE),
        });

        this.adapterHost.httpAdapter.setCookie(response, "refreshToken", tokens.refreshToken, {
            ...cookieOptions,
            maxAge: Number(process.env.COOKIE_RT_AGE),
        });
    }

    clearAuthCookies(response: NodeResponse) {
        this.adapterHost.httpAdapter.clearCookie(response, "accessToken");
        this.adapterHost.httpAdapter.clearCookie(response, "refreshToken");
    }
}
