import DatabaseService from "@/database/database.service.js";
import { watchlistsTable } from "@/database/schema/index.js";
import { Injectable, HttpStatus, BadRequestException, UnprocessableEntityException } from "@nestjs/common";
import { and, eq, desc } from "drizzle-orm";

@Injectable()
export default class WatchlistService {
    constructor(private readonly db: DatabaseService) {}

    async addWatchlist(body: Record<string, string>, userId: string) {
        if (!body.name) {
            throw new BadRequestException("Name is required.");
        }

        const [foundWatchlist] = await this.db.query
            .select()
            .from(watchlistsTable)
            .where(and(eq(watchlistsTable.name, body.name), eq(watchlistsTable.userId, userId)))
            .limit(1);

        if (foundWatchlist) {
            throw new UnprocessableEntityException(`${body.name} already exists.`);
        }

        const [watchlist] = await this.db.query
            .insert(watchlistsTable)
            .values({
                name: body.name,
                description: body.description,
                userId,
            })
            .returning();

        return {
            status: HttpStatus.CREATED,
            message: "Added successfully.",
            data: watchlist,
        };
    }

    async updateWatchlist(watchlistId: string, body: Record<string, string>) {
        if (!watchlistId) {
            throw new BadRequestException("Watchlist ID is required.");
        }

        const [updatedEntry] = await this.db.query
            .update(watchlistsTable)
            .set({
                name: body.name,
                description: body.description,
            })
            .where(eq(watchlistsTable.id, watchlistId))
            .returning();

        return {
            message: "Updated successfully.",
            data: updatedEntry,
        };
    }

    async deleteWatchlist(watchlistId: string) {
        if (!watchlistId) {
            throw new BadRequestException("Watchlist ID is required.");
        }

        await this.db.query.delete(watchlistsTable).where(eq(watchlistsTable.id, watchlistId));

        return {
            message: "Deleted successfully.",
        };
    }

    async retrieveWatchlists(userId: string) {
        const watchlists = await this.db.query
            .select()
            .from(watchlistsTable)
            .where(eq(watchlistsTable.userId, userId))
            .orderBy(desc(watchlistsTable.updatedAt));

        return {
            data: watchlists,
        };
    }
}
