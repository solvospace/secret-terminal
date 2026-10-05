import { secretTerminalDb } from "../../config/db.js";
import appHttpStatus from "../../constants/http-status-code.js";

async function addWatchlistCoin(requestBody: Record<string, string>) {
    const foundWatchlistCoin = await secretTerminalDb.watchlistCoin.findFirst({
        where: {
            coinId: requestBody.coinId,
            watchlistId: requestBody.watchlistId,
        },
    });

    if (foundWatchlistCoin?.id) {
        throw new Error(`${requestBody.name} already added in watchlist!!`, {
            cause: { status: appHttpStatus.unProcessableContent },
        });
    }

    const watchlistCoin = await secretTerminalDb.watchlistCoin.create({
        data: {
            watchlistId: requestBody.watchlistId,
            coinId: requestBody.coinId,
            name: requestBody.name,
            symbol: requestBody.symbol,
            imageUrl: requestBody.imageUrl,
        },
    });

    return {
        status: appHttpStatus.created,
        message: "Added Successfully!!",
        data: watchlistCoin,
    };
}

async function deleteWatchListCoin(watchlistCoinId: string) {
    if (!watchlistCoinId) {
        throw new Error("watchlistCoinId is required!!", {
            cause: { status: appHttpStatus.badRequest },
        });
    }

    const deletedWatchlistCoin = await secretTerminalDb.watchlistCoin.delete({
        where: { id: watchlistCoinId },
    });

    return {
        status: appHttpStatus.ok,
        message: "Deleted Successfully",
    };
}

async function retrieveWatchlistCoins(params: Record<string, string | null | undefined>) {
    const watchlistCoins = await secretTerminalDb.watchlistCoin.findMany(
        params.watchlistId
            ? {
                  where: {
                      watchlistId: params.watchlistId,
                  },
                  orderBy: {
                      updatedAt: "desc",
                  },
              }
            : undefined,
    );

    return {
        status: appHttpStatus.ok,
        data: watchlistCoins,
    };
}

const WatchlistCoinService = { addWatchlistCoin, deleteWatchListCoin, retrieveWatchlistCoins };

export default WatchlistCoinService;
