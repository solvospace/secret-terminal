import { Request, Response } from "express";
import WatchListService from "./watchlist.service.js";

async function addWatchlist(request: Request, response: Response) {
    try {
        const watchlist = await WatchListService.addWatchlist(request.body, request.userId);

        return response.status(200).json({
            data: watchlist,
            message: "Added Successfully!!",
        });
    } catch (error: unknown) {
        return handleError(error, response);
    }
}

async function updateWatchlist(request: Request, response: Response) {
    try {
        const watchlistId = request.params.id.toString();
        const watchlist = await WatchListService.updateWatchlist(watchlistId, request.body);

        return response.status(200).json({
            data: watchlist,
            message: "Updated Successfully!!",
        });
    } catch (error: unknown) {
        return handleError(error, response);
    }
}

async function deleteWatchlist(request: Request, response: Response) {
    try {
        const watchlistId = request.params.id.toString();
        const deletedEntry = await WatchListService.deleteWatchlist(watchlistId);

        if (deletedEntry.id) {
            return response.status(200).json({
                message: "Deleted Successfully!!",
            });
        }
    } catch (error: unknown) {
        return handleError(error, response);
    }
}

async function retrieveWatchlists(request: Request, response: Response) {
    try {
        const watchlists = await WatchListService.retrieveWatchlists(request.userId);

        return response.status(response.appHttpStatus).json({
            data: watchlists,
        });
    } catch (error: unknown) {
        return handleError(error, response);
    }
}

function handleError(error: unknown, response: Response) {
    return response.status(400).json({
        message: error instanceof Error ? error.message : JSON.stringify(error),
    });
}

export { addWatchlist, updateWatchlist, deleteWatchlist, retrieveWatchlists };
