import { Request, Response } from "express";
import { handleFailure, handleSuccess } from "../../services/handle-response.service.js";
import { Result } from "../../classes/result.class.js";
import NewsService from "../news/news.service.js";

const retrieveLatestNews = async (request: Request, response: Response) => {
    try {
        const results = await NewsService.retrieveLatestNews();
        handleSuccess(response, new Result(results));
    } catch (error) {
        handleFailure(response, error);
    }
};

export { retrieveLatestNews };
