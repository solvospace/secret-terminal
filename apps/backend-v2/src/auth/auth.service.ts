import type { SignUpProperties, SignInProperties } from "./auth.types.js";

import { AppException } from "../common/exceptions/app.exception.js";
import HashService from "../common/services/hash.service.js";
import MailService from "../common/services/mail.service.js";
import TokenService from "../common/services/token.service.js";
import { PrismaService } from "../prisma/prisma.service.js";
import { Injectable, HttpStatus } from "@nestjs/common";
import { FastifyReply } from "fastify";
import crypto from "node:crypto";

const cookieOptions = {
    httpOnly: true,
    secure: true,
    sameSite: "none" as const,
    path: "/",
};

@Injectable()
export class AuthenticationService {
    constructor(private readonly prisma: PrismaService) {}

    async signUp(properties: SignUpProperties) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: properties.email },
        });

        if (existingUser) {
            throw new AppException({
                message: "User already exists.",
                cause: {
                    status: HttpStatus.CONFLICT,
                },
            });
        }

        const verificationCode = this.generateCode();
        const hashedPassword = await HashService.generateHash(properties.password);

        const user = await this.prisma.user.create({
            data: {
                name: properties.name,
                email: properties.email,
                password: hashedPassword,
                verificationCode,
            },
        });

        if (user.id) {
            await this.mailVerificationCode(user.email, verificationCode);
        }

        return {
            data: { verified: user.verified },
            message: "Verify your account. A verification code has been sent to you.",
            status: HttpStatus.CREATED,
        };
    }

    async signIn(properties: SignInProperties) {
        if (!properties.email) {
            throw new AppException({
                message: "Email is required.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        if (!properties.password) {
            throw new AppException({
                message: "Password is required.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { email: properties.email },
        });

        if (!foundUser) {
            throw new AppException({
                message: "Incorrect email or password.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        const isMatch = await HashService.compareHashed(properties.password, foundUser.password);

        if (!isMatch) {
            throw new AppException({
                message: "Incorrect email or password.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
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
                throw new AppException({
                    message: "Incorrect email.",
                    cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
                });
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

        await this.mailVerificationCode(email, verificationCode);

        return {
            tokens: null,
            data: { verified: false },
            message: "A verification code has been sent to your email.",
            status: HttpStatus.OK,
        };
    }

    async verifyAccount({ email, code }: Record<string, string>) {
        if (!email) {
            throw new AppException({
                message: "Email is required.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        if (!code) {
            throw new AppException({
                message: "Verification code is required.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!foundUser) {
            throw new AppException({
                message: "User doesn't exist.",
                cause: { status: HttpStatus.NOT_FOUND },
            });
        }

        if (foundUser.verified) {
            throw new AppException({
                message: "Account is already verified.",
                cause: { status: HttpStatus.CONFLICT },
            });
        }

        if (foundUser.verificationCode !== code) {
            throw new AppException({
                message: "Invalid verification code.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        if (!foundUser.verificationCodeExpiresAt || new Date() > foundUser.verificationCodeExpiresAt) {
            throw new AppException({
                message: "Verification code has expired.",
                cause: { status: HttpStatus.UNAUTHORIZED },
            });
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
            throw new AppException({
                message: "Email is required.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
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
        const hashedCode = await HashService.generateHash(resetCode);

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

        await MailService.sendResetCode(email, resetCode);

        return {
            message,
            status: HttpStatus.OK,
        };
    }

    async verifyResetCode(properties: Record<string, string>) {
        const { resetCode, email } = properties;

        if (!resetCode) {
            throw new AppException({
                message: "Reset code is required.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        if (!email) {
            throw new AppException({
                message: "Email is required.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!foundUser) {
            throw new AppException({
                message: "Invalid reset request.",
                cause: { status: HttpStatus.NOT_FOUND },
            });
        }

        const resetCodeEntry = await this.prisma.resetCode.findFirst({
            where: { userId: foundUser.id },
        });

        if (!resetCodeEntry) {
            throw new AppException({
                message: "Invalid reset code.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        if (new Date() >= resetCodeEntry.expiresAt) {
            throw new AppException({
                message: "Reset code expired.",
                cause: { status: HttpStatus.UNAUTHORIZED },
            });
        }

        const isCodeMatched = await HashService.compareHashed(resetCode, resetCodeEntry.code);

        if (!isCodeMatched) {
            throw new AppException({
                message: "Invalid reset code.",
                cause: { status: HttpStatus.UNAUTHORIZED },
            });
        }

        await this.prisma.resetCode.delete({
            where: { id: resetCodeEntry.id },
        });

        const updatePasswordToken = TokenService.generateAccessToken({
            userId: foundUser.id,
            purpose: "change-password",
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
            throw new AppException({
                message: "Password is required.",
                cause: { status: HttpStatus.UNPROCESSABLE_ENTITY },
            });
        }

        const foundUser = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!foundUser) {
            throw new AppException({
                message: "User doesn't exist.",
                cause: { status: HttpStatus.NOT_FOUND },
            });
        }

        const hashedPassword = await HashService.generateHash(password);

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
            throw new AppException({
                message: "Refresh token is missing.",
                cause: { status: HttpStatus.UNAUTHORIZED },
            });
        }

        const decoded = TokenService.verifyRefreshToken(token);

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
            throw new AppException({
                message: "Invalid or expired refresh token.",
                cause: { status: HttpStatus.UNAUTHORIZED },
            });
        }

        const user = await this.prisma.user.findUnique({
            where: { id: decoded.payload.userId },
        });

        if (!user) {
            throw new AppException({
                message: "User not found.",
                cause: { status: HttpStatus.NOT_FOUND },
            });
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
            throw new AppException({
                message: "Please clear this site's cookies and sign in again.",
                cause: { status: HttpStatus.UNAUTHORIZED },
            });
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
            throw new AppException({
                message: "User ID is missing.",
                cause: { status: HttpStatus.BAD_REQUEST },
            });
        }

        const tokenPayload = { userId };

        const newAccessToken = TokenService.generateAccessToken(tokenPayload);
        const newRefreshToken = TokenService.generateRefreshToken(tokenPayload);

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

    setAuthCookies(reply: FastifyReply, tokens: { accessToken: string; refreshToken: string }) {
        reply.cookie("accessToken", tokens.accessToken, {
            ...cookieOptions,
            maxAge: Number(process.env.COOKIE_AT_AGE),
        });

        reply.cookie("refreshToken", tokens.refreshToken, {
            ...cookieOptions,
            maxAge: Number(process.env.COOKIE_RT_AGE),
        });
    }

    clearAuthCookies(reply: FastifyReply) {
        reply.clearCookie("accessToken", cookieOptions);
        reply.clearCookie("refreshToken", cookieOptions);
    }

    private generateCode(length = 6) {
        const min = Math.pow(10, length - 1);
        const max = Math.pow(10, length);

        return crypto.randomInt(min, max).toString();
    }

    private async mailVerificationCode(email: string, code: string) {
        try {
            await MailService.sendAccountVerificationCode(email, code);
        } catch {
            throw new AppException({
                message: "Failed to send verification email.",
                cause: { status: HttpStatus.INTERNAL_SERVER_ERROR },
            });
        }
    }
}
