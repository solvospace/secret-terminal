import type { FastifyReply } from "fastify";

import TrendingService from "./trending.service.js";
import { handleResponse } from "@/common/utils/api-response.util.js";
import { Controller, Get, Res } from "@nestjs/common";

@Controller("trending")
export default class TrendingController {
    constructor(private readonly trendingService: TrendingService) {}

    @Get()
    async getTrendingData(@Res({ passthrough: true }) reply: FastifyReply) {
        const result = await this.trendingService.retrieveTrendingData();
        return handleResponse(reply, result);
    }
}
