import { Request, Response } from "express";
import { handleSuccess, handleFailure } from "../../services/handle-response.service.js";
import { Result } from "../../classes/result.class.js";
import MarketChartService from "./market-chart.service.js";

const getMarketChartData = async (request: Request, response: Response) => {
    try {
        const coinId = request.params.id.toString();
        const queryParams = request.query;

        const result = await MarketChartService.retrieveMarketChartData(coinId, queryParams);
        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
    }
};

export { getMarketChartData };
