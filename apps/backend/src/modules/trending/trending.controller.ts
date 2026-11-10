import TrendingService from "./trending.service.js";
import { Controller, Get } from "@nestjs/common";

@Controller("trending")
export default class TrendingController {
    constructor(private readonly trendingService: TrendingService) {}

    @Get()
    async getTrendingData() {
        return await this.trendingService.retrieveTrendingData();
    }
}
