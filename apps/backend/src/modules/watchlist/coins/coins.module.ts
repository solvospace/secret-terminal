import CoinsController from "./coins.controller.js";
import CoinsService from "./coins.service.js";
import AuthenticationModule from "@/modules/auth/auth.module.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [AuthenticationModule],
    controllers: [CoinsController],
    providers: [CoinsService],
    exports: [CoinsService],
})
export default class WatchlistCoinsModule {}
