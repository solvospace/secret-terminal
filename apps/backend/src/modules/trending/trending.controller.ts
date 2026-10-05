import { Request, Response } from "express";
import { handleSuccess, handleFailure } from "../../services/handle-response.service.js";
import TrendingService from "../trending/trending.service.js";
import appHttpStatus from "../../constants/http-status-code.js";
import { Result } from "../../classes/result.class.js";

const getTrendingData = async (request: Request, response: Response) => {
    try {
        const result = await TrendingService.retrieveTrendingData();
        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
    }
};

export { getTrendingData };
