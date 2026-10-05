import { checkImageUrl } from "@secret-terminal/services/image.service";
import appHttpStatus from "../../constants/http-status-code.js";

async function retrieveLatestNews() {
    try {
        if (!process.env.NEWS_API_KEY) {
            throw new Error("Unauthorized");
        }

        const params: Record<string, string> = {
            apikey: process.env.NEWS_API_KEY!,
            language: "en",
            domainurl: "coindesk.com,theblock.co",
        };

        const paramsString = new URLSearchParams(params).toString();

        const response = await fetch(`https://newsdata.io/api/1/crypto?${paramsString}`);
        const jsonData = await response.json();

        if (jsonData.status === "error") {
            throw new Error(jsonData.results.message ? jsonData.results.message : jsonData.results[0].message);
        }

        const articles = await createResponseData(jsonData.results);

        return {
            status: appHttpStatus.ok,
            data: {
                data: articles,
                nextPage: jsonData.nextPage,
            },
        };
    } catch (error: unknown) {
        throw error;
    }
}

async function createResponseData(serverArticles: Record<string, string>[]) {
    if (!serverArticles || serverArticles.length === 0) return [];

    let articles = [];

    const uniqueArticlesMap = new Map();

    for (const article of serverArticles) {
        if (!article.description) article.description = article.title;
        if (article.description && !uniqueArticlesMap.get(article.description)) {
            uniqueArticlesMap.set(article.description, article);
        }
    }

    for (const [key, article] of uniqueArticlesMap) {
        articles.push({
            id: article.article_id,
            title: article.title ? article.title : null,
            description: article.description ? article.description : article.title,
            url: article.link,
            publishedAt: article.pubDate,
            imageUrl: article.image_url,
            author: article.creator && article.creator.length > 0 && article.creator[0],
            source: {
                id: article.source_id,
                name: article.source_name,
                icon: await checkSourceImageIcon(article.source_icon),
            },
        });
    }

    return articles;
}

async function checkSourceImageIcon(url: string) {
    try {
        const isValid = await checkImageUrl(url);
        if (isValid) return url;
    } catch (error) {
        return null;
    }
}

const NewsService = {
    retrieveLatestNews,
};

export default NewsService;
