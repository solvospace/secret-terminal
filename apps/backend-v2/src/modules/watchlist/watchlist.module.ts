import { TokenVerification } from "../../common/guards/token-verification.guard.js";
import WatchlistCoinsModule from "./coins/coins.module.js";
import WatchlistController from "./watchlist.controller.js";
import WatchlistService from "./watchlist.service.js";
import { RenewToken } from "@/common/guards/renew-token.guard.js";
import { Module } from "@nestjs/common";
import { RouterModule } from "@nestjs/core";

@Module({
    controllers: [WatchlistController],
    providers: [WatchlistService, TokenVerification, RenewToken],
    imports: [
        WatchlistModule,
        RouterModule.register([
            {
                path: "watchlist",
                module: WatchlistModule,
                children: [
                    {
                        path: "coins",
                        module: WatchlistCoinsModule,
                    },
                ],
            },
        ]),
    ],
})
export default class WatchlistModule {}
