import { verify } from "hcaptcha";
import { Request, Response, NextFunction } from "express";
import { AppError } from "../classes/error.class.js";
import appHttpStatus from "../constants/http-status-code.js";
import { handleFailure } from "../services/handle-response.service.js";

export default async function captchaVerification(request: Request, response: Response, next: NextFunction) {
    try {
        const captchaToken = request.body.captchaToken ? request.body.captchaToken : request.query.captchaToken;

        if (!captchaToken || !process.env.CAPTCHA_SECRET_KEY) {
            throw new AppError({
                message: "Unauthorized.",
                cause: {
                    status: appHttpStatus.unauthorized,
                },
            });
        }

        const result = await verify(process.env.CAPTCHA_SECRET_KEY, captchaToken);

        if (result.success === false) {
            throw new AppError({
                message: result["error-codes"] ? result["error-codes"][0] : "Failed!!",
                cause: {
                    status: appHttpStatus.unauthorized,
                },
            });
        }

        next();
    } catch (error) {
        handleFailure(response, error);
    }
}
