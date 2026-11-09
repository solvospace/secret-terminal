import GlobalMarketController from "./global-market.controller.js";
import GlobalMarketService from "./global-market.service.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [GlobalMarketController],
    providers: [GlobalMarketService],
})
export class GlobalMarketModule {}
