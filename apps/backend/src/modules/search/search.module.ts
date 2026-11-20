import SearchController from "./search.controller.js";
import SearchService from "./search.service.js";
import HttpModule from "@/integrations/http/http.module.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [HttpModule],
    controllers: [SearchController],
    providers: [SearchService],
})
export default class SearchModule {}
