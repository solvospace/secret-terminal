import { cleanResponse } from "../../common/services/clean-response.service.js";
import { Injectable, UnauthorizedException, BadGatewayException } from "@nestjs/common";
import { checkImageUrl } from "@secret-terminal/services/image.service";
import type { NewsArticle, NewsApiResponse } from "./news.types.js";

@Injectable()
export default class NewsService {
    async retrieveLatestNews() {
        if (!process.env.NEWS_API_KEY) {
            throw new UnauthorizedException("News API key is not configured.");
        }

        const params = new URLSearchParams({
            apikey: process.env.NEWS_API_KEY,
            language: "en",
            domainurl: "coindesk.com,theblock.co",
        });

        const response = await fetch(`${process.env.NEWS_API_URL}?${params.toString()}`);

        if (!response.ok) {
            throw new BadGatewayException("Failed to retrieve latest news.");
        }

        const jsonData = (await response.json()) as NewsApiResponse;

        if (jsonData.status === "error") {
            const message =
                jsonData.results?.message ?? jsonData.results?.[0]?.message ?? "Failed to retrieve latest news.";

            throw new BadGatewayException(message);
        }

        const articles = await this.createResponseData(jsonData.results);

        return {
            data: {
                data: cleanResponse(articles),
                nextPage: jsonData.nextPage,
            },
        };
    }

    private async createResponseData(serverArticles: NewsArticle[] = []) {
        if (!serverArticles.length) return [];

        const uniqueArticlesMap = new Map<string, NewsArticle>();

        for (const article of serverArticles) {
            if (!article.description) {
                article.description = article.title ?? null;
            }

            if (article.description && !uniqueArticlesMap.has(article.description)) {
                uniqueArticlesMap.set(article.description, article);
            }
        }

        const articles = [];

        for (const article of uniqueArticlesMap.values()) {
            articles.push({
                id: article.article_id,
                title: article.title ?? null,
                description: article.description ?? article.title ?? null,
                url: article.link,
                publishedAt: article.pubDate,
                imageUrl: article.image_url,
                author: article.creator?.[0] ?? null,
                source: {
                    id: article.source_id,
                    name: article.source_name,
                    icon: await this.checkSourceImageIcon(article.source_icon),
                },
            });
        }

        return articles;
    }

    private async checkSourceImageIcon(url?: string | null) {
        if (!url) return null;

        try {
            const isValid = await checkImageUrl(url);
            return isValid ? url : null;
        } catch {
            return null;
        }
    }
}
