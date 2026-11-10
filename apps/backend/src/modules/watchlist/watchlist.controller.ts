import type { AuthenticatedRequest } from "@/common/types/authenticated-request.type.js";

import WatchlistService from "./watchlist.service.js";
import { RenewToken } from "@/common/guards/renew-token.guard.js";
import { TokenVerification } from "@/common/guards/token-verification.guard.js";
import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";

@Controller()
@UseGuards(TokenVerification, RenewToken)
export default class WatchlistController {
    constructor(private readonly watchlistService: WatchlistService) {}

    @Post()
    async addWatchlist(@Req() request: AuthenticatedRequest, @Body() body: Record<string, string>) {
        return await this.watchlistService.addWatchlist(body, request.userId);
    }

    @Patch(":id")
    async updateWatchlist(@Param("id") watchlistId: string, @Body() body: Record<string, string>) {
        return await this.watchlistService.updateWatchlist(watchlistId, body);
    }

    @Delete(":id")
    async deleteWatchlist(@Param("id") watchlistId: string) {
        return await this.watchlistService.deleteWatchlist(watchlistId);
    }

    @Get()
    async retrieveWatchlists(@Req() request: AuthenticatedRequest) {
        return await this.watchlistService.retrieveWatchlists(request.userId);
    }
}
