import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe.js";
import CoinsService from "./coins.service.js";
import { watchlistCoinSchema } from "./coins.validation.js";
import { RenewToken } from "@/common/guards/renew-token.guard.js";
import { TokenVerification } from "@/common/guards/token-verification.guard.js";
import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common";

@Controller()
@UseGuards(TokenVerification, RenewToken)
export default class CoinsController {
    constructor(private readonly coinsService: CoinsService) {}

    @Post()
    async addWatchlistCoin(
        @Body(new ZodValidationPipe(watchlistCoinSchema))
        body: any,
    ) {
        return await this.coinsService.addWatchlistCoin(body);
    }

    @Delete(":id")
    async deleteWatchlistCoin(@Param("id") id: string) {
        return await this.coinsService.deleteWatchListCoin(id);
    }

    @Get()
    async retrieveWatchlistCoins(@Query() queryParams: Record<string, string>) {
        return await this.coinsService.retrieveWatchlistCoins({
            watchlistId: queryParams.watchlistId,
        });
    }
}
