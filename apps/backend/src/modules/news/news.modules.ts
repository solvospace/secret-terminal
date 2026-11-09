import NewsController from "./news.controller.js";
import NewsService from "./news.service.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [NewsController],
    providers: [NewsService],
})
export class NewsModule {}
