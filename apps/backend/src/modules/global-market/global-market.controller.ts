import GlobalMarketService from "./global-market.service.js";
import { Controller, Get } from "@nestjs/common";

@Controller("global-market")
export default class GlobalMarketController {
    constructor(private readonly globalMarketService: GlobalMarketService) {}

    @Get()
    async getGlobalMarketData() {
        return await this.globalMarketService.retrieveGlobalMarketData();
    }
}
