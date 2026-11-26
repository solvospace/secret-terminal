import CookieMiddleware from "./common/middlewares/cookie.middleware.js";
import HttpModule from "./integrations/http/http.module.js";
import MailModule from "./integrations/mail/mail.module.js";
import AiModule from "./modules/ai/ai.module.js";
import CoinsModule from "./modules/coins/coins.module.js";
import GlobalMarketModule from "./modules/global-market/global-market.module.js";
import MarketChartModule from "./modules/market-chart/market-chart.module.js";
import NewsModule from "./modules/news/news.modules.js";
import SearchModule from "./modules/search/search.module.js";
import SharedModule from "./modules/shared/shared.module.js";
import TrendingModule from "./modules/trending/trending.module.js";
import WatchlistCoinsModule from "./modules/watchlist/coins/coins.module.js";
import WatchlistModule from "./modules/watchlist/watchlist.module.js";
import DatabaseModule from "@/database/database.module.js";
import AuthenticationModule from "@/modules/auth/auth.module.js";
import UserModule from "@/modules/user/user.module.js";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        ThrottlerModule.forRoot({
            throttlers: [
                {
                    name: "short",
                    ttl: 1000,
                    limit: 3,
                },
                {
                    name: "medium",
                    ttl: 10000,
                    limit: 20,
                },
                {
                    name: "long",
                    ttl: 60000,
                    limit: 100,
                },
            ],
        }),
        DatabaseModule,
        SharedModule,
        HttpModule,
        MailModule,
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
    providers: [
        AppService,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard,
        },
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CookieMiddleware).forRoutes("*path");
    }
}
