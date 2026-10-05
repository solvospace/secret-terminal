import { z, ZodType } from "zod";
import { NextFunction, Request, Response } from "express";
import appHttpStatus from "../constants/http-status-code.js";

export default function schemaVerification(schema: ZodType) {
    return (request: Request, response: Response, next: NextFunction) => {
        try {
            schema.parse(request.body);
            next();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const issue = error.issues[0];
                const field = String(issue.path.at(-1));

                return response.status(appHttpStatus.unProcessableContent).json({
                    message: `${field}: ${issue.message}`,
                });
            }

            return response.status(appHttpStatus.unauthorized).json({
                message: "Invalid Credentials!!",
            });
        }
    };
}
