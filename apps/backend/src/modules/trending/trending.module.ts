import TrendingController from "./trending.controller.js";
import TrendingService from "./trending.service.js";
import HttpModule from "@/integrations/http/http.module.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [HttpModule],
    controllers: [TrendingController],
    providers: [TrendingService],
})
export default class TrendingModule {}
