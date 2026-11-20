import { createHttpClient } from "./http-client.factory.js";
import { HTTP_CLIENTS } from "./http.tokens.js";
import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Module({
    providers: [
        {
            provide: HTTP_CLIENTS.COINGECKO,
            useFactory: (config: ConfigService) =>
                createHttpClient(config, "COIN_GECKO_BASE_URL", {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                    "x-cg-demo-api-key": config.get("COIN_GECKO_API_KEY"),
                }),
            inject: [ConfigService],
        },
    ],
    exports: Object.values(HTTP_CLIENTS),
})
export default class HttpModule {}
