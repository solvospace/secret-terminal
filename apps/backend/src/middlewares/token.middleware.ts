import { Request, Response, NextFunction } from "express";
import { Jwt } from "../types/jwt.types.js";
import TokenService from "../services/token.service.js";
import appHttpStatus from "../constants/http-status-code.js";

export default async function tokenVerification(request: Request, response: Response, next: NextFunction) {
    try {
        const refreshToken = request.cookies.refreshToken;

        if (!refreshToken) throw new Error("Your session has expired. Please sign in again.");

        const decodedRt = TokenService.verifyRefreshToken(refreshToken) as Jwt;
        if (decodedRt.error) throw new Error(decodedRt.error);

        setNoCacheHeaders(response);
        next();
    } catch (error) {
        if (error instanceof Error) {
            return response.status(appHttpStatus.unauthorized).json({
                success: false,
                message: error.message,
            });
        }
    }
}

function setNoCacheHeaders(response: Response) {
    response.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
    });
}
