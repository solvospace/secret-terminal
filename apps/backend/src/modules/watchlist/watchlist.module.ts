import { TokenVerification } from "../../common/guards/token-verification.guard.js";
import AuthenticationModule from "../auth/auth.module.js";
import WatchlistCoinsModule from "./coins/coins.module.js";
import WatchlistController from "./watchlist.controller.js";
import WatchlistService from "./watchlist.service.js";
import { RenewToken } from "@/common/guards/renew-token.guard.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [AuthenticationModule, WatchlistCoinsModule],
    controllers: [WatchlistController],
    providers: [WatchlistService, TokenVerification, RenewToken],
})
export default class WatchlistModule {}
