import type { CoinListApiParams } from "@secret-terminal/types/coin-list.types";

import CoinsService from "./coins.service.js";
import { Controller, Get, Param, Query } from "@nestjs/common";

@Controller("coins")
export default class CoinsController {
    constructor(private readonly coinsService: CoinsService) {}

    @Get()
    async getCoinList(@Query() queryParams: CoinListApiParams) {
        return await this.coinsService.retrieveCoinList(queryParams);
    }

    @Get(":id")
    async getCoinById(@Param("id") id: string) {
        return await this.coinsService.retrieveCoinById(id);
    }
}
