import GlobalMarketController from "./global-market.controller.js";
import GlobalMarketService from "./global-market.service.js";
import HttpModule from "@/integrations/http/http.module.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [HttpModule],
    controllers: [GlobalMarketController],
    providers: [GlobalMarketService],
})
export default class GlobalMarketModule {}
