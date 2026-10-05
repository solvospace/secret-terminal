import { Request, Response } from "express";
import WatchListService from "./watchlist.service.js";
import { handleFailure, handleSuccess } from "../../services/handle-response.service.js";

async function addWatchlist(request: Request, response: Response) {
    try {
        const result = await WatchListService.addWatchlist(request.body, request.userId);
        handleSuccess(response, result);
    } catch (error: unknown) {
        handleFailure(response, error);
    }
}

async function updateWatchlist(request: Request, response: Response) {
    try {
        const watchlistId = request.params.id.toString();
        const result = await WatchListService.updateWatchlist(watchlistId, request.body);
        handleSuccess(response, result);
    } catch (error: unknown) {
        handleFailure(response, error);
    }
}

async function deleteWatchlist(request: Request, response: Response) {
    try {
        const watchlistId = request.params.id.toString();
        const result = await WatchListService.deleteWatchlist(watchlistId);
        handleSuccess(response, result);
    } catch (error: unknown) {
        handleFailure(response, error);
    }
}

async function retrieveWatchlists(request: Request, response: Response) {
    try {
        const result = await WatchListService.retrieveWatchlists(request.userId);
        handleSuccess(response, result);
    } catch (error: unknown) {
        handleFailure(response, error);
    }
}

export { addWatchlist, updateWatchlist, deleteWatchlist, retrieveWatchlists };
