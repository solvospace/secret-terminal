import { z } from "zod";

const watchlistCoinSchema = z.object({
    watchlistId: z.string("watchlistId is required!!"),
    coinId: z.string("coinId is required!!"),
    name: z.string("coin name is required!!"),
    symbol: z.string("symbol is required!!"),
});

export { watchlistCoinSchema };
