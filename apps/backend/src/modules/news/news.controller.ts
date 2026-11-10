import NewsService from "./news.service.js";
import { Controller, Get } from "@nestjs/common";

@Controller("news")
export default class NewsController {
    constructor(private readonly newsService: NewsService) {}

    @Get("latest")
    async retrieveLatestNews() {
        return await this.newsService.retrieveLatestNews();
    }
}
