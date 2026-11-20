import MarketChartController from "./market-chart.controller.js";
import MarketChartService from "./market-chart.service.js";
import HttpModule from "@/integrations/http/http.module.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [HttpModule],
    controllers: [MarketChartController],
    providers: [MarketChartService],
})
export default class MarketChartModule {}
