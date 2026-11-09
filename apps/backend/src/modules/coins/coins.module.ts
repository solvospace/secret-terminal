import CoinsController from "./coins.controller.js";
import CoinsService from "./coins.service.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [CoinsController],
    providers: [CoinsService],
})
export class CoinsModule {}
