import { AppError } from "../classes/error.class.js";
import { ResultOptions } from "../classes/result.class.js";
import { Response } from "express";
import statusCode from "../constants/http-status-code.js";
import appHttpStatus from "../constants/http-status-code.js";

const handleSuccess = (response: Response, result: ResultOptions) => {
    return response.status(result.status).json({
        message: result.message,
        data: result.data,
    });
};

const handleFailure = (response: Response, error: unknown) => {
    if (error instanceof AppError) {
        console.error(error.stack);

        return response.status(error.cause.status).json({
            message: error.message,
        });
    }

    if (error instanceof Error) {
        console.error(error.stack);

        return response.status(statusCode.internalServerError).json({
            message: "We couldn't complete your request. Please try again later.",
        });
    }

    return response.status(statusCode.internalServerError).json({
        message: "Something went wrong. Please try again in a moment.",
    });
};

export { handleSuccess, handleFailure };
