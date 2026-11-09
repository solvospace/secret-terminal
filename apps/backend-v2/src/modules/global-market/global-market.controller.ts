import type { FastifyReply } from "fastify";

import GlobalMarketService from "./global-market.service.js";
import { handleResponse } from "@/common/utils/api-response.util.js";
import { Controller, Get, Res } from "@nestjs/common";

@Controller("global-market")
export default class GlobalMarketController {
    constructor(private readonly globalMarketService: GlobalMarketService) {}

    @Get()
    async getGlobalMarketData(@Res({ passthrough: true }) reply: FastifyReply) {
        const result = await this.globalMarketService.retrieveGlobalMarketData();
        return handleResponse(reply, result);
    }
}
