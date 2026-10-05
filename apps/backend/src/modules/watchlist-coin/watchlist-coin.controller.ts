import { Request, Response } from "express";
import WatchlistCoinService from "./watchlist-coin.service.js";
import { handleFailure, handleSuccess } from "../../services/handle-response.service.js";

async function addWatchlistCoin(request: Request, response: Response) {
    try {
        const result = await WatchlistCoinService.addWatchlistCoin(request.body);
        handleSuccess(response, result);
    } catch (error: unknown) {
        handleFailure(response, error);
    }
}

async function deleteWatchlistCoin(request: Request, response: Response) {
    try {
        const watchlistCoinId = request.params.id.toString();
        const result = await WatchlistCoinService.deleteWatchListCoin(watchlistCoinId);
        handleSuccess(response, result);
    } catch (error: unknown) {
        handleFailure(response, error);
    }
}

async function retrieveWatchlistCoins(request: Request, response: Response) {
    try {
        const params = {
            watchlistId: request.query.watchlistId ? String(request.query.watchlistId) : null,
        };

        const result = await WatchlistCoinService.retrieveWatchlistCoins(params);
        handleSuccess(response, result);
    } catch (error: unknown) {
        handleFailure(response, error);
    }
}

export { addWatchlistCoin, deleteWatchlistCoin, retrieveWatchlistCoins };
