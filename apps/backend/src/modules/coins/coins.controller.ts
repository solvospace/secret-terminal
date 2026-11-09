import type { CoinListApiParams } from "@secret-terminal/types/coin-list.types";
import type { FastifyReply } from "fastify";

import CoinsService from "./coins.service.js";
import { handleResponse } from "@/common/utils/api-response.util.js";
import { Controller, Get, Param, Query, Res } from "@nestjs/common";

@Controller("coins")
export default class CoinsController {
    constructor(private readonly coinsService: CoinsService) {}

    @Get()
    async getCoinList(@Query() queryParams: CoinListApiParams, @Res({ passthrough: true }) reply: FastifyReply) {
        const result = await this.coinsService.retrieveCoinList(queryParams);
        return handleResponse(reply, result);
    }

    @Get(":id")
    async getCoinById(@Param("id") id: string, @Res({ passthrough: true }) reply: FastifyReply) {
        const result = await this.coinsService.retrieveCoinById(id);
        return handleResponse(reply, result);
    }
}
