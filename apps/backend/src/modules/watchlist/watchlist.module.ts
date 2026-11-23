import WatchlistCoinsModule from "./coins/coins.module.js";
import WatchlistController from "./watchlist.controller.js";
import WatchlistService from "./watchlist.service.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [WatchlistCoinsModule],
    controllers: [WatchlistController],
    providers: [WatchlistService],
})
export default class WatchlistModule {}
