import type { FastifyReply } from "fastify";

import NewsService from "./news.service.js";
import { handleResponse } from "@/common/utils/api-response.util.js";
import { Controller, Get, Res } from "@nestjs/common";

@Controller("news")
export default class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Get("latest")
    async retrieveLatestNews(@Res({ passthrough: true }) reply: FastifyReply) {
        const result = await this.newsService.retrieveLatestNews();
        return handleResponse(reply, result);
    }
}
