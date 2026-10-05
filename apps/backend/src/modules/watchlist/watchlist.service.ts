import { secretTerminalDb } from "../../config/db.js";
import appHttpStatus from "../../constants/http-status-code.js";

async function addWatchlist(body: Record<string, string>, userId: string) {
    if (!body.name) {
        throw new Error("Name is required!!", {
            cause: {
                status: appHttpStatus.badRequest,
            },
        });
    }

    const foundWatchlist = await secretTerminalDb.watchlist.findFirst({
        where: {
            name: body.name,
            userId: userId,
        },
    });

    if (foundWatchlist?.id) {
        throw new Error(`${body.name} is already exist!!`, {
            cause: {
                status: appHttpStatus.unProcessableContent,
            },
        });
    }

    const watchlist = await secretTerminalDb.watchlist.create({
        data: {
            name: body.name,
            description: body.description,
            userId: userId,
        },
    });

    return {
        message: "Added Successfully!!",
        status: appHttpStatus.created,
        data: watchlist,
    };
}

async function updateWatchlist(watchlistId: string, body: Record<string, string>) {
    if (!watchlistId) {
        throw new Error("watchlistId is required!!", {
            cause: {
                status: appHttpStatus.badRequest,
            },
        });
    }

    const updatedEntry = await secretTerminalDb.watchlist.update({
        where: {
            id: watchlistId,
        },
        data: {
            name: body.name,
            description: body.description,
        },
    });

    return {
        message: "Updated Successfully!!",
        status: appHttpStatus.ok,
        data: updatedEntry,
    };
}

async function deleteWatchlist(watchlistId: string) {
    if (!watchlistId) {
        throw new Error("watchlistId is required!!", {
            cause: {
                status: appHttpStatus.badRequest,
            },
        });
    }

    const deletedEntry = await secretTerminalDb.watchlist.delete({
        where: {
            id: watchlistId,
        },
    });

    return {
        message: "Deleted Successfully!!",
        status: appHttpStatus.ok,
    };
}

async function retrieveWatchlists(userId: string) {
    const watchlists = await secretTerminalDb.watchlist.findMany({
        where: {
            userId: userId,
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    return {
        status: appHttpStatus.ok,
        data: watchlists,
    };
}

const WatchlistService = {
    addWatchlist,
    updateWatchlist,
    deleteWatchlist,
    retrieveWatchlists,
};

export default WatchlistService;
