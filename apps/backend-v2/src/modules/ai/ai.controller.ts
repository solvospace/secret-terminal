import type { FastifyReply } from "fastify";

import { AppException } from "@/common/exceptions/app.exception.js";
import { handleResponse } from "@/common/utils/api-response.util.js";
import { Body, Controller, HttpCode, HttpStatus, Post, Res } from "@nestjs/common";
import { generateText } from "ai";

@Controller("ai")
export default class AiController {
    @Post("generate-text")
    @HttpCode(HttpStatus.OK)
    async produce(@Body() body: any, @Res({ passthrough: true }) reply: FastifyReply) {
        const { prompt, model } = body;

        if (!prompt)
            throw new AppException({ message: "Prompt is required.", cause: { status: HttpStatus.BAD_REQUEST } });

        const { text } = await generateText({
            model: model ?? "openai/gpt-5",
            prompt,
        });

        return handleResponse(reply, { data: text });
    }
}
