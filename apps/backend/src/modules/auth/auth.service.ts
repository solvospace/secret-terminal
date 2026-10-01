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
        throw new Error("User already exist.");
    }

    const hashedPassword = await HashService.generateHash(properties.password);
    const user = await secretTerminalDb.user.create({
        data: {
            name: properties.name,
            email: properties.email,
            password: hashedPassword,
        },
    });

    const tokens = await manageTokens(user.id);
    return { tokens, user };
}

async function signIn(properties: LoginProperties) {
    if (!properties.email) throw new Error("Email missing!!.");

    const foundUser = await secretTerminalDb.user.findUnique({
        where: {
            email: properties.email,
        },
    });

    if (!foundUser) {
        throw new Error("Incorrect username!!");
    }

    const isMatch = await HashService.compareHashed(properties.password, foundUser.password);

    if (!isMatch) {
        throw new Error("Incorrect password!!");
    }

    const tokens = await manageTokens(foundUser.id, properties.cookies.refreshToken);
    return tokens;
}

async function forgotPassword(email: string) {
    if (!email) throw new Error("Email missing!!");

    const foundUser = await secretTerminalDb.user.findUnique({
        where: { email },
    });

    if (!foundUser) throw new Error(`User doesn't exist!!`);

    await secretTerminalDb.resetCode.deleteMany({
        where: {
            userId: foundUser.id,
        },
    });

    const resetCode = generateCode();
    const hashedCode = await HashService.generateHash(resetCode);

    await secretTerminalDb.resetCode.create({
        data: {
            userId: foundUser.id,
            code: hashedCode,
        },
    });

    await MailService.sendResetCode(email, resetCode);
    return { message: "Sent!!" };
}

async function verifyResetCode(properties: Record<string, string>) {
    const { resetCode, email } = properties;

    if (!resetCode) throw new Error("Reset code missing!!");
    if (!email) throw new Error("Email is missing!!");

    const foundUser = await secretTerminalDb.user.findUnique({
        where: {
            email: properties.email,
        },
    });

    if (!foundUser) throw new Error("No user found which is associated with this email!!");

    const resetCodeEntry = await secretTerminalDb.resetCode.findFirst({
        where: {
            userId: foundUser.id,
        },
    });

    if (!resetCodeEntry) throw new Error("Invalid reset code!!");

    if (resetCodeEntry.expiresAt < new Date() || resetCodeEntry.verified) {
        throw new Error("Reset code expired!!!");
    }

    const isHashedCodeMatched = HashService.compareHashed(properties.resetCode, resetCodeEntry.code);

    if (!isHashedCodeMatched) throw new Error("Invalid reset code!!");

    await secretTerminalDb.resetCode.delete({
        where: {
            id: resetCodeEntry.id,
            userId: foundUser.id,
        },
    });

    const updatePasswordToken = TokenService.generateAccessToken({ userId: foundUser.id, purpose: "change-password" });

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
    const storedToken = await secretTerminalDb.refreshToken.findUnique({ where: { token: token } });

    if (!storedToken?.id) {
        throw new Error("Invalid token.");
    }

    const deletedToken = await secretTerminalDb.refreshToken.delete({ where: { id: storedToken.id } });
    return deletedToken;
}

async function manageTokens(userId: string, token?: string) {
    if (!userId) {
        throw new Error("userId is missing.");
    }

    if (token) {
        const storedToken = await secretTerminalDb.refreshToken.findUnique({ where: { token: token } });
        if (storedToken) {
            await secretTerminalDb.refreshToken.delete({ where: { id: storedToken.id } });
        }
    }

    const tokenPayload = { userId: userId };
    const newAccessToken = TokenService.generateAccessToken(tokenPayload);
    const newRefreshToken = TokenService.generateRefreshToken(tokenPayload);

    await secretTerminalDb.refreshToken.create({ data: { userId: userId, token: newRefreshToken } });

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
};

export default AuthenticationService;
