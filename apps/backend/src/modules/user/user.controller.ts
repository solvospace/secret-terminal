import { Request, Response } from "express";
import UserService from "./user.service.js";
import { handleFailure, handleSuccess } from "../../services/handle-response.service.js";

const userDetails = async (request: Request, response: Response) => {
    try {
        const userId = request.userId;
        const result = await UserService.retrieveUserDetails(userId);
        handleSuccess(response, result);
    } catch (error: unknown) {
        handleFailure(response, error);
    }
};

export { userDetails };
