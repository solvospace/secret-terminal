import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import AiModule from "./modules/ai/ai.module.js";
import CoinsModule from "./modules/coins/coins.module.js";
import GlobalMarketModule from "./modules/global-market/global-market.module.js";
import MarketChartModule from "./modules/market-chart/market-chart.module.js";
import NewsModule from "./modules/news/news.modules.js";
import SearchModule from "./modules/search/search.module.js";
import TrendingModule from "./modules/trending/trending.module.js";
import WatchlistCoinsModule from "./modules/watchlist/coins/coins.module.js";
import WatchlistModule from "./modules/watchlist/watchlist.module.js";
import AuthenticationModule from "@/modules/auth/auth.module.js";
import UserModule from "@/modules/user/user.module.js";
import { PrismaModule } from "@/prisma/prisma.module.js";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { RouterModule } from "@nestjs/core";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        PrismaModule,
        AuthenticationModule,
        UserModule,
        WatchlistModule,
        RouterModule.register([
            {
                path: "watchlists",
                module: WatchlistModule,
                children: [
                    {
                        path: "coins",
                        module: WatchlistCoinsModule,
                    },
                ],
            },
        ]),
        TrendingModule,
        AiModule,
        SearchModule,
        NewsModule,
        MarketChartModule,
        GlobalMarketModule,
        CoinsModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
