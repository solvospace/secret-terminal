export interface NewsArticle {
    article_id: string;
    title?: string | null;
    description?: string | null;
    link?: string | null;
    pubDate?: string | null;
    image_url?: string | null;
    creator?: string[] | null;
    source_id?: string | null;
    source_name?: string | null;
    source_icon?: string | null;
}

export interface NewsApiResponse {
    status: string;
    results: NewsArticle[] & Record<string, string> & Record<string, string>[];
    nextPage?: string;
}
