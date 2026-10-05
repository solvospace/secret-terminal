import { Request, Response, NextFunction } from "express";
import TokenService from "../services/token.service.js";
import { Jwt } from "../types/jwt.types.js";
import appHttpStatus from "../constants/http-status-code.js";

export default function cpTokenVerification(request: Request, response: Response, next: NextFunction) {
    try {
        const cpt = request.cookies.cpt;

        if (!cpt) throw new Error("Your session has expired. Please try again.");

        const decodedCpt = TokenService.verifyAccessToken(cpt) as Jwt;
        if (decodedCpt.error) throw new Error(decodedCpt.error);

        if (decodedCpt.payload.purpose !== "change-password" || !decodedCpt.payload.userId) {
            throw new Error("Invalid token!!");
        }

        setNoCacheHeaders(response);

        request.userId = decodedCpt.payload.userId;

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
