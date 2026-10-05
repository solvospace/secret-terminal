import { Request, Response } from "express";
import { handleFailure, handleSuccess } from "../../services/handle-response.service.js";
import GlobalMarketService from "../global-market/global-market.service.js";
import { Result } from "../../classes/result.class.js";

const getGlobalMarketData = async (request: Request, response: Response) => {
    try {
        const result = await GlobalMarketService.retrieveGlobalMarketData();
        handleSuccess(response, result);
    } catch (error) {
        handleFailure(response, error);
    }
};

export { getGlobalMarketData };
