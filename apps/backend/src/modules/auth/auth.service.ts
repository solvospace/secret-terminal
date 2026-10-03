import { secretTerminalDb } from "../../config/db.js";
import { Response } from "express";
import crypto from "crypto";
import HashService from "../../services/hash.service.js";
import TokenService from "../../services/token.service.js";
import MailService from "../../services/mail.service.js";
import type { SignUpProperties, LoginProperties } from "./auth.types.js";
import type { Jwt } from "../../types/jwt.types.js";

async function signUp(properties: SignUpProperties) {
    const existingUser = await secretTerminalDb.user.findUnique({ where: { email: properties.email } });

    if (existingUser) {
        throw new Error("User already exists.");
    }

    const verificationCode = generateCode();

    const hashedPassword = await HashService.generateHash(properties.password);
    const user = await secretTerminalDb.user.create({
        data: {
            name: properties.name,
            email: properties.email,
            password: hashedPassword,
            verificationCode,
        },
    });

    if (user.id) await mailVerificationCode(user.email, verificationCode);

    return { message: "Verify your account. A verification code has been sent to you.", user };
}

async function signIn(properties: LoginProperties) {
    if (!properties.email) throw new Error("Email is required.");
    if (!properties.password) throw new Error("Password is required.");

    const foundUser = await secretTerminalDb.user.findUnique({
        where: {
            email: properties.email,
        },
    });

    if (!foundUser) throw new Error("Incorrect email or password.");
    const isMatch = await HashService.compareHashed(properties.password, foundUser.password);

    if (!isMatch) throw new Error("Incorrect email or password.");

    if (!foundUser.verified) {
        return await sendVerificationCode(foundUser.email, foundUser.id);
    }

    const tokens = await manageTokens(foundUser.id, properties.cookies.refreshToken);
    return {
        tokens,
        verified: foundUser.verified,
        message: "Welcome back! Glad to see you again.",
    };
}

async function sendVerificationCode(email: string, userId?: string) {
    let localUserId = userId;

    if (!localUserId) {
        const foundUser = await secretTerminalDb.user.findUnique({
            where: {
                email,
            },
            select: {
                id: true,
            },
        });

        if (!foundUser) {
            throw new Error("Incorrect email.");
        }

        localUserId = foundUser.id;
    }

    const verificationCode = generateCode();

    const verificationCodeExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await secretTerminalDb.user.update({
        where: {
            id: localUserId,
        },
        data: {
            verificationCode,
            verificationCodeExpiresAt,
        },
    });

    await mailVerificationCode(email, verificationCode);

    return {
        tokens: null,
        verified: false,
        message: "A verification code has been sent to your email.",
    };
}

async function verifyAccount({ email, code }: Record<string, string>) {
    if (!email) throw new Error("Email is required.");
    if (!code) throw new Error("Verification code is required.");

    const foundUser = await secretTerminalDb.user.findUnique({
        where: { email },
    });

    if (!foundUser) {
        throw new Error("User doesn't exist.");
    }

    if (foundUser.verified) {
        throw new Error("Account is already verified.");
    }

    if (foundUser.verificationCode !== code) {
        throw new Error("Invalid verification code.");
    }

    if (new Date() > foundUser.verificationCodeExpiresAt) {
        throw new Error("Verification code has expired.");
    }

    await secretTerminalDb.user.update({
        where: {
            id: foundUser.id,
        },
        data: {
            verified: true,
            verificationCode: null,
        },
    });

    const tokens = await manageTokens(foundUser.id);

    return {
        tokens,
        message: "Account verified successfully.",
    };
}

async function forgotPassword(email: string) {
    if (!email) throw new Error("Email missing!!");

    const foundUser = await secretTerminalDb.user.findUnique({
        where: { email },
    });

    if (!foundUser) {
        return {
            message: "If the email exists, a reset code has been sent.",
        };
    }

    const resetCode = generateCode();
    const hashedCode = await HashService.generateHash(resetCode);

    await secretTerminalDb.$transaction(async (tx) => {
        await tx.resetCode.deleteMany({
            where: {
                userId: foundUser.id,
            },
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
        message: "If the email exists, a reset code has been sent.",
    };
}

async function verifyResetCode(properties: Record<string, string>) {
    const { resetCode, email } = properties;

    if (!resetCode) throw new Error("Reset code missing!!");
    if (!email) throw new Error("Email is missing!!");

    const foundUser = await secretTerminalDb.user.findUnique({
        where: {
            email,
        },
    });

    if (!foundUser) {
        throw new Error("Invalid reset request!!");
    }

    const resetCodeEntry = await secretTerminalDb.resetCode.findFirst({
        where: {
            userId: foundUser.id,
        },
    });

    if (!resetCodeEntry) {
        throw new Error("Invalid reset code!!");
    }

    if (new Date() >= resetCodeEntry.expiresAt) {
        throw new Error("Reset code expired!!");
    }

    const isCodeMatched = await HashService.compareHashed(resetCode, resetCodeEntry.code);

    if (!isCodeMatched) {
        throw new Error("Invalid reset code!!");
    }

    await secretTerminalDb.resetCode.delete({
        where: {
            id: resetCodeEntry.id,
        },
    });

    const updatePasswordToken = TokenService.generateAccessToken({
        userId: foundUser.id,
        purpose: "change-password",
    });

    return {
        message: "Verified!!",
        token: updatePasswordToken,
    };
}

async function changePassword(properties: Record<string, string>) {
    const { userId, password } = properties;

    if (!password) throw new Error("Password is required!!");

    const foundUser = await secretTerminalDb.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!foundUser) throw new Error(`User doesn't exist!!!`);

    const hashedPassword = await HashService.generateHash(password);

    await secretTerminalDb.user.update({
        where: {
            id: foundUser.id,
            email: foundUser.email,
        },
        data: {
            password: hashedPassword,
        },
    });

    return "Password updated successfully!!";
}

async function refreshToken(token: string) {
    if (!token) {
        throw new Error("Refresh token is missing!");
    }

    const decoded = (TokenService.verifyRefreshToken(token) as Jwt).payload;
    const user = await secretTerminalDb.user.findUnique({
        where: {
            id: decoded.userId,
        },
    });

    if (!user) {
        throw new Error("User not found");
    }

    const tokens = await manageTokens(user.id, token);
    return tokens;
}

async function signOut(token: string) {
    const storedToken = await secretTerminalDb.refreshToken.findUnique({
        where: { token },
    });

    if (!storedToken) {
        throw new Error("Invalid token.");
    }

    return secretTerminalDb.refreshToken.delete({
        where: {
            id: storedToken.id,
        },
    });
}

async function manageTokens(userId: string, token?: string) {
    if (!userId) {
        throw new Error("userId is missing.");
    }

    const tokenPayload = { userId };

    const newAccessToken = TokenService.generateAccessToken(tokenPayload);
    const newRefreshToken = TokenService.generateRefreshToken(tokenPayload);

    await secretTerminalDb.$transaction(async (tx) => {
        if (token) {
            const storedToken = await tx.refreshToken.findUnique({
                where: {
                    token,
                },
            });

            if (storedToken) {
                await tx.refreshToken.delete({
                    where: {
                        id: storedToken.id,
                    },
                });
            }
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

function generateCode(length = 6) {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;

    return crypto.randomInt(min, max).toString();
}

function setResponseHeaders(response: Response, result: { accessToken: string; refreshToken: string }) {
    response.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 15 * 60 * 1000,
        sameSite: "none",
    });

    response.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        sameSite: "none",
        path: "/auth",
    });
}

function clearTokensFromCookies(response: Response) {
    response.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });

    response.clearCookie("accessToken", {
        httpOnly: true,
        secure: true,
        sameSite: "none",
    });
}

async function mailVerificationCode(email: string, code: string) {
    try {
        await MailService.sendAccountVerificationCode(email, code);
    } catch (error) {
        throw new Error("Failed to send verification email.");
    }
}

const AuthenticationService = {
    signUp,
    signIn,
    refreshToken,
    forgotPassword,
    verifyResetCode,
    changePassword,
    signOut,
    setResponseHeaders,
    clearTokensFromCookies,
    manageTokens,
    verifyAccount,
    sendVerificationCode,
};

export default AuthenticationService;
