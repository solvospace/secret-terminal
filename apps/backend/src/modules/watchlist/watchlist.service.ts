import { PrismaService } from "../../prisma/prisma.service.js";
import { Injectable, HttpStatus, BadRequestException, UnprocessableEntityException } from "@nestjs/common";

@Injectable()
export default class WatchlistService {
    constructor(private readonly prisma: PrismaService) {}

    async addWatchlist(body: Record<string, string>, userId: string) {
        if (!body.name) {
            throw new BadRequestException("Name is required.");
        }

        const foundWatchlist = await this.prisma.watchlist.findFirst({
            where: {
                name: body.name,
                userId,
            },
        });

        if (foundWatchlist) {
            throw new UnprocessableEntityException(`${body.name} already exists.`);
        }

        const watchlist = await this.prisma.watchlist.create({
            data: {
                name: body.name,
                description: body.description,
                userId,
            },
        });

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

        const updatedEntry = await this.prisma.watchlist.update({
            where: {
                id: watchlistId,
            },
            data: {
                name: body.name,
                description: body.description,
            },
        });

        return {
            message: "Updated successfully.",
            data: updatedEntry,
        };
    }

    async deleteWatchlist(watchlistId: string) {
        if (!watchlistId) {
            throw new BadRequestException("Watchlist ID is required.");
        }

        await this.prisma.watchlist.delete({
            where: {
                id: watchlistId,
            },
        });

        return {
            message: "Deleted successfully.",
        };
    }

    async retrieveWatchlists(userId: string) {
        const watchlists = await this.prisma.watchlist.findMany({
            where: {
                userId,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        return {
            data: watchlists,
        };
    }
}
