import { Request, Response, NextFunction } from "express";
import { Jwt } from "../types/jwt.types.js";
import TokenService from "../services/token.service.js";
import appHttpStatus from "../constants/http-status-code.js";
import { AppError } from "../classes/error.class.js";
import { handleFailure } from "../services/handle-response.service.js";

export default async function tokenVerification(request: Request, response: Response, next: NextFunction) {
    try {
        const refreshToken = request.cookies.refreshToken;

        if (!refreshToken)
            throw new AppError({
                message: "Your session has expired. Please sign in again.",
                cause: {
                    status: appHttpStatus.unauthorized,
                },
            });

        const decodedRt = TokenService.verifyRefreshToken(refreshToken) as Jwt;

        if (decodedRt.error) {
            throw new AppError({
                message: "Your session has expired. Please sign in again.",
                cause: {
                    status: appHttpStatus.unauthorized,
                },
            });
        }

        setNoCacheHeaders(response);
        next();
    } catch (error) {
        handleFailure(response, error);
    }
}

function setNoCacheHeaders(response: Response) {
    response.set({
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
    });
}
