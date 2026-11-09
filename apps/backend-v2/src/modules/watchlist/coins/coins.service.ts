import { AppException } from "@/common/exceptions/app.exception.js";
import { PrismaService } from "@/prisma/prisma.service.js";
import { HttpStatus, Injectable } from "@nestjs/common";

@Injectable()
export default class CoinsService {
    constructor(private readonly prisma: PrismaService) {}

    async addWatchlistCoin(requestBody: any) {
        const foundWatchlistCoin = await this.prisma.watchlistCoin.findFirst({
            where: {
                coinId: requestBody.coinId,
                watchlistId: requestBody.watchlistId,
            },
        });

        if (foundWatchlistCoin?.id) {
            throw new AppException({
                message: `${requestBody.name} already added in watchlist!!`,
                cause: {
                    status: HttpStatus.UNPROCESSABLE_ENTITY,
                },
            });
        }

        const watchlistCoin = await this.prisma.watchlistCoin.create({
            data: {
                watchlistId: requestBody.watchlistId,
                coinId: requestBody.coinId,
                name: requestBody.name,
                symbol: requestBody.symbol,
                imageUrl: requestBody.imageUrl,
            },
        });

        return {
            status: HttpStatus.CREATED,
            message: "Added Successfully!!",
            data: watchlistCoin,
        };
    }

    async deleteWatchListCoin(watchlistCoinId: string) {
        if (!watchlistCoinId) {
            throw new AppException({
                message: "watchlistCoinId is required!!",
                cause: {
                    status: HttpStatus.BAD_REQUEST,
                },
            });
        }

        await this.prisma.watchlistCoin.delete({
            where: {
                id: watchlistCoinId,
            },
        });

        return {
            message: "Deleted Successfully",
        };
    }

    async retrieveWatchlistCoins(params: Record<string, string | null | undefined>) {
        const watchlistCoins = await this.prisma.watchlistCoin.findMany(
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
            data: watchlistCoins,
        };
    }
}
