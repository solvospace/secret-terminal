import { Request, Response } from "express";
import UserService from "./user.service.js";
import appHttpStatus from "../../constants/http-status-code.js";
import { AppError } from "../../classes/error.class.js";

const userDetails = async (request: Request, response: Response) => {
    try {
        const userId = request.userId;
        const user = await UserService.retrieveUserDetails(userId);

        if (user && user.id) {
            return response.status(appHttpStatus.ok).json({
                data: user,
            });
        }
    } catch (error: unknown) {
        if (error instanceof AppError && error.cause) {
            return response.status(error.cause.status).json({
                message: error.message,
            });
        }

        return response.status(appHttpStatus.internalServerError).json({
            message: "Internal Server Error",
        });
    }
};

export { userDetails };
