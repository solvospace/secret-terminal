import SearchController from "./search.controller.js";
import SearchService from "./search.service.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [SearchController],
    providers: [SearchService],
})
export default class SearchModule {}
