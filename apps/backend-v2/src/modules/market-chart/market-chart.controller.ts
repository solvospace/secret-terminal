import type { FastifyReply } from "fastify";

import MarketChartService from "./market-chart.service.js";
import { handleResponse } from "@/common/utils/api-response.util.js";
import { Controller, Get, Param, Query, Res } from "@nestjs/common";

@Controller("market-chart")
export default class MarketChartController {
    constructor(private readonly marketChartService: MarketChartService) {}

    @Get(":id")
    async getMarketChartData(
        @Param("id") coinId: string,
        @Query() queryParams: Record<string, string>,
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const result = await this.marketChartService.retrieveMarketChartData(coinId, queryParams);
        return handleResponse(reply, result);
    }
}
