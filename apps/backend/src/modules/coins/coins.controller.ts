import { Request, Response } from "express";
import { handleFailure, handleSuccess } from "../../services/handle-response.service.js";
import CoinService from "../coins/coins.service.js";
import { Result } from "../../classes/result.class.js";

const getCoinList = async (request: Request, response: Response) => {
    try {
        const queryParams = request.query;
        const result = await CoinService.retrieveCoinList(queryParams);
        handleSuccess(response, new Result(result));
    } catch (error) {
        handleFailure(response, error);
    }
};

const getCoinById = async (request: Request, response: Response) => {
    try {
        const result = await CoinService.retrieveCoinById(request.params.id.toString());
        handleSuccess(response, new Result(result));
    } catch (error) {
        handleFailure(response, error);
    }
};

export { getCoinList, getCoinById };
