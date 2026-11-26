import DatabaseService from "@/database/database.service.js";
import { watchlistCoinsTable } from "@/database/schema/index.js";
import { BadRequestException, HttpStatus, Injectable, UnprocessableEntityException } from "@nestjs/common";
import { and, eq, desc } from "drizzle-orm";

@Injectable()
export default class CoinsService {
    constructor(private readonly db: DatabaseService) {}

    async addWatchlistCoin(requestBody: any) {
        const [foundWatchlistCoin] = await this.db.query
            .select()
            .from(watchlistCoinsTable)
            .where(
                and(
                    eq(watchlistCoinsTable.coinId, requestBody.coinId),
                    eq(watchlistCoinsTable.watchlistId, requestBody.watchlistId),
                ),
            );

        if (foundWatchlistCoin?.id) {
            throw new UnprocessableEntityException(`${requestBody.name} already added in watchlist!!`);
        }

        const [watchlistCoin] = await this.db.query
            .insert(watchlistCoinsTable)
            .values({
                watchlistId: requestBody.watchlistId,
                coinId: requestBody.coinId,
                name: requestBody.name,
                symbol: requestBody.symbol,
                imageUrl: requestBody.imageUrl,
            })
            .returning();

        return {
            status: HttpStatus.CREATED,
            message: "Added Successfully!!",
            data: watchlistCoin,
        };
    }

    async deleteWatchListCoin(watchlistCoinId: string) {
        if (!watchlistCoinId) {
            throw new BadRequestException("watchlistCoinId is required!!");
        }

        await this.db.query.delete(watchlistCoinsTable).where(eq(watchlistCoinsTable.id, watchlistCoinId));

        return {
            message: "Deleted Successfully",
        };
    }

    async retrieveWatchlistCoins(params: Record<string, string | null | undefined>) {
        if (!params.watchlistId) {
            throw new BadRequestException("watchlist is required!.");
        }

        const watchlistCoins = await this.db.query
            .select()
            .from(watchlistCoinsTable)
            .where(eq(watchlistCoinsTable.watchlistId, params.watchlistId))
            .orderBy(desc(watchlistCoinsTable.updatedAt));

        return {
            data: watchlistCoins,
        };
    }
}
