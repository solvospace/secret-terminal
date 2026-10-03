import { Request, Response, NextFunction } from "express";
import { Jwt } from "../types/jwt.types.js";
import TokenService from "../services/token.service.js";
import AuthenticationService from "../modules/auth/auth.service.js";
import statusCode from "../constants/http-status-code.js";

export default async function renewToken(request: Request, response: Response, next: NextFunction) {
    try {
        let userId;
        const accessToken = request.cookies.accessToken;
        const refreshToken = request.cookies.refreshToken;

        if (!refreshToken) throw new Error("Your session has expired. Please sign in again.");

        const decodedRt = TokenService.verifyRefreshToken(refreshToken) as Jwt;
        if (decodedRt.error) throw new Error(decodedRt.error);

        userId = decodedRt.payload.userId;

        if (!accessToken) {
            const tokens = await AuthenticationService.manageTokens(userId, refreshToken);
            AuthenticationService.clearTokensFromCookies(response);
            AuthenticationService.setResponseHeaders(response, tokens);
        }

        request.userId = userId;

        next();
    } catch (error) {
        return response.status(statusCode.unauthorized).json({
            success: false,
            message: error instanceof Error ? error.message : JSON.stringify(error),
        });
    }
}
