import MarketChartService from "./market-chart.service.js";
import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("market-chart")
export default class MarketChartController {
    constructor(private readonly marketChartService: MarketChartService) {}

    @Get(":id")
    async getMarketChartData(@Param("id") coinId: string, @Query() queryParams: Record<string, string>) {
        return await this.marketChartService.retrieveMarketChartData(coinId, queryParams);
    }
}
