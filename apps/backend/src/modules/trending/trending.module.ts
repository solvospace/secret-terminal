import TrendingController from "./trending.controller.js";
import TrendingService from "./trending.service.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [TrendingController],
    providers: [TrendingService],
})
export default class TrendingModule {}
