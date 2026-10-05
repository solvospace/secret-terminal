import { Request, Response } from "express";
import { handleFailure, handleSuccess } from "../../services/handle-response.service.js";
import { Result } from "../../classes/result.class.js";
import SearchService from "../search/search.service.js";

const getSearchData = async (request: Request, response: Response) => {
    try {
        const result = await SearchService.search(request.query);
        handleSuccess(response, new Result(result));
    } catch (error) {
        handleFailure(response, error);
    }
};

export { getSearchData };
