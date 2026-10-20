import { Request, Response, NextFunction } from "express";
import { generateText } from "ai";
import { handleSuccess, handleFailure } from "../../services/handle-response.service.js";
import { AppError } from "../../classes/error.class.js";
import appHttpStatus from "../../constants/http-status-code.js";

const produce = async (request: Request, response: Response) => {
    try {
        const { prompt, model } = request.body;

        if (!prompt) throw new AppError({ message: "Prompt is required.", cause: { status: appHttpStatus.badRequest } });

        const { text } = await generateText({
            model: model ?? "openai/gpt-5",
            prompt,
        });

        handleSuccess(response, {
            status: appHttpStatus.ok,
            data: text,
        });
    } catch (error) {
        handleFailure(response, error);
    }
};

export { produce };
