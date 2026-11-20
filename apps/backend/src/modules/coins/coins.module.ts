import CoinsController from "./coins.controller.js";
import CoinsService from "./coins.service.js";
import HttpModule from "@/integrations/http/http.module.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [HttpModule],
    controllers: [CoinsController],
    providers: [CoinsService],
})
export default class CoinsModule {}
