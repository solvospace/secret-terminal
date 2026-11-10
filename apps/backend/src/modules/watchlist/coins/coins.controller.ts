import type { FastifyReply } from "fastify";

import { ZodValidationPipe } from "../../../common/pipes/zod-validation.pipe.js";
import CoinsService from "./coins.service.js";
import { watchlistCoinSchema } from "./coins.validation.js";
import { RenewToken } from "@/common/guards/renew-token.guard.js";
import { TokenVerification } from "@/common/guards/token-verification.guard.js";
import { handleResponse } from "@/common/utils/api-response.util.js";
import { Body, Controller, Delete, Get, Param, Post, Query, Res, UseGuards } from "@nestjs/common";

@Controller()
@UseGuards(TokenVerification, RenewToken)
export default class CoinsController {
    constructor(private readonly coinsService: CoinsService) {}

    @Post()
    async addWatchlistCoin(
        @Body(new ZodValidationPipe(watchlistCoinSchema))
        @Res({ passthrough: true })
        reply: FastifyReply,
        body: any,
    ) {
        const result = await this.coinsService.addWatchlistCoin(body);
        return handleResponse(reply, result);
    }

    @Delete(":id")
    async deleteWatchlistCoin(
        @Param("id") id: string,
        @Res({ passthrough: true })
        reply: FastifyReply,
    ) {
        const result = await this.coinsService.deleteWatchListCoin(id);
        return handleResponse(reply, result);
    }

    @Get()
    async retrieveWatchlistCoins(
        @Query() queryParams: Record<string, string>,
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const result = await this.coinsService.retrieveWatchlistCoins({
            watchlistId: queryParams.watchlistId,
        });

        return handleResponse(reply, result);
    }
}
