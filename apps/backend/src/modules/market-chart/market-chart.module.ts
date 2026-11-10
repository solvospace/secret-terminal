import MarketChartController from "./market-chart.controller.js";
import MarketChartService from "./market-chart.service.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [MarketChartController],
    providers: [MarketChartService],
})
export default class MarketChartModule {}
