import type { AuthenticatedRequest } from "@/common/types/authenticated-request.type.js";
import type { FastifyReply } from "fastify";

import WatchlistService from "./watchlist.service.js";
import { RenewToken } from "@/common/guards/renew-token.guard.js";
import { TokenVerification } from "@/common/guards/token-verification.guard.js";
import { handleResponse } from "@/common/utils/api-response.util.js";
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from "@nestjs/common";

@Controller()
@UseGuards(TokenVerification, RenewToken)
export default class WatchlistController {
    constructor(private readonly watchlistService: WatchlistService) {}

    @Post()
    async addWatchlist(
        @Req() request: AuthenticatedRequest,
        @Res({ passthrough: true }) reply: FastifyReply,
        @Body() body: Record<string, string>,
    ) {
        const result = await this.watchlistService.addWatchlist(body, request.userId);
        return handleResponse(reply, result);
    }

    @Patch(":id")
    async updateWatchlist(
        @Param("id") watchlistId: string,
        @Body() body: Record<string, string>,
        @Res({ passthrough: true }) reply: FastifyReply,
    ) {
        const result = await this.watchlistService.updateWatchlist(watchlistId, body);
        return handleResponse(reply, result);
    }

    @Delete(":id")
    async deleteWatchlist(@Param("id") watchlistId: string, @Res({ passthrough: true }) reply: FastifyReply) {
        const result = await this.watchlistService.deleteWatchlist(watchlistId);
        return handleResponse(reply, result);
    }

    @Get()
    async retrieveWatchlists(@Req() request: AuthenticatedRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        const result = await this.watchlistService.retrieveWatchlists(request.userId);
        return handleResponse(reply, result);
    }
}
