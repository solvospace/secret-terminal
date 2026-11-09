import type { FastifyReply } from "fastify";

import SearchService from "./search.service.js";
import { handleResponse } from "@/common/utils/api-response.util.js";
import { Controller, Get, Query, Res } from "@nestjs/common";

@Controller("search")
export default class SearchController {
    constructor(private readonly searchService: SearchService) {}

    @Get()
    async getSearchData(@Query() query: Record<string, string>, @Res({ passthrough: true }) reply: FastifyReply) {
        const result = await this.searchService.search(query);
        return handleResponse(reply, result);
    }
}
