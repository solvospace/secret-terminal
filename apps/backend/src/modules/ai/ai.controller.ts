import { BadRequestException, Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { generateText } from "ai";

@Controller("ai")
export default class AiController {
    @Post("generate-text")
    @HttpCode(HttpStatus.OK)
    async produce(@Body() body: any) {
        const { prompt, model } = body;

        if (!prompt) throw new BadRequestException("Prompt is required.");

        const { text } = await generateText({
            model: model ?? "openai/gpt-5",
            prompt,
        });

        return { data: text };
    }
}
