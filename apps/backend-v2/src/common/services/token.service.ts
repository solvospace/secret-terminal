import type { StringValue } from "ms";

import jwt from "jsonwebtoken";

function generateAccessToken(payload: object) {
    return jwt.sign({ payload }, process.env.JWT_ACCESS_TOKEN_SECRET as string, {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN as StringValue,
    });
}

function generateRefreshToken(payload: object) {
    return jwt.sign({ payload }, process.env.JWT_REFRESH_TOKEN_SECRET as string, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN as StringValue,
    });
}

function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_REFRESH_TOKEN_SECRET as string);
    } catch {
        return { error: "Invalid or expired token." };
    }
}

function verifyAccessToken(token: string) {
    try {
        return jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET as string);
    } catch {
        return { error: "Invalid or expired token." };
    }
}

const TokenService = { generateAccessToken, generateRefreshToken, verifyRefreshToken, verifyAccessToken };

export default TokenService;
