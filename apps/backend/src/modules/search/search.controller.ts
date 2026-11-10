import SearchService from "./search.service.js";
import { Controller, Get, Query } from "@nestjs/common";

@Controller("search")
export default class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    async getSearchData(@Query() query: Record<string, string>) {
        return await this.searchService.search(query);
    }
}
