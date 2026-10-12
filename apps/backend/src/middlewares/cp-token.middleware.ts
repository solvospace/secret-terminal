import { Request, Response, NextFunction } from "express";
import { Jwt } from "../types/jwt.types.js";
import { AppError } from "../classes/error.class.js";
import { handleFailure } from "../services/handle-response.service.js";
import TokenService from "../services/token.service.js";
import appHttpStatus from "../constants/http-status-code.js";

export default function cpTokenVerification(request: Request, response: Response, next: NextFunction) {
    try {
        const cpt = request.cookies.cpt;

        if (!cpt) {
            throw new AppError({
                message: "Your session has expired. Please try again.",
                cause: {
                    status: appHttpStatus.unauthorized,
                },
            });
        }

        const decodedCpt = TokenService.verifyAccessToken(cpt) as Jwt;

        if (decodedCpt.error) {
            throw new AppError({
                message: decodedCpt.error,
                cause: {
                    status: appHttpStatus.unauthorized,
                },
            });
        }

        if (decodedCpt.payload.purpose !== "change-password" || !decodedCpt.payload.userId) {
            throw new AppError({
                message: "Your session has expired. Please try again.",
                cause: {
                    status: appHttpStatus.unauthorized,
                },
            });
        }

        setNoCacheHeaders(response);

        request.userId = decodedCpt.payload.userId;

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
