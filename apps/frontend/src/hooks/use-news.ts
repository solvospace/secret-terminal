import { useEffect, useState } from "react";
import { retrieveLatestNews } from "@/services/news.service";
import type { NewsArticle } from "@/interfaces/news.interface";

type Bindings = {
    showDialog: boolean;
};

export default function useNews({ showDialog }: Bindings) {
    const [articles, setArticles] = useState<NewsArticle[] | null>(null);
    const [fetchingLatestNews, setFetchingLatestNews] = useState<boolean>(false);

    useEffect(() => {
        if (!showDialog) return;

        fetchLatestNews();
    }, [showDialog]);

    async function fetchLatestNews() {
        try {
            setFetchingLatestNews(true);
            const response = await retrieveLatestNews();
            setArticles(response?.data.data.data);
        } catch (error) {
        } finally {
            setFetchingLatestNews(false);
        }
    }

    return {
        fetchingLatestNews,
        articles,
    };
}
