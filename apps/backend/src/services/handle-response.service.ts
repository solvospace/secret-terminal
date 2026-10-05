import { AppError } from "../classes/error.class.js";
import { Result } from "../classes/result.class.js";
import statusCode from "../constants/http-status-code.js";
import { Response } from "express";

const handleSuccess = (response: Response, result?: unknown) => {
    if (result instanceof Result) {
        const message = result.message ?? undefined;
        const data = result.data ?? undefined;

        return response.status(result.status).json({ message, data });
    }
};

const handleFailure = (response: Response, error?: unknown) => {
    if (error instanceof AppError && error.cause) {
        return response.status(error.cause.status).json({
            message: error.message,
        });
    }

    return response.status(statusCode.internalServerError).json({
        message: "Something went wrong. Please try again in a moment.",
    });
};

export { handleSuccess, handleFailure };
