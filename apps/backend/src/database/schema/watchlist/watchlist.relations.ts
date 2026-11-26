import { usersTable } from "../auth/auth.schema.js";
import { watchlistsTable, watchlistCoinsTable } from "./watchlist.schema.js";
import { relations } from "drizzle-orm";

export const watchlistsRelations = relations(watchlistsTable, ({ one, many }) => ({
    user: one(usersTable, {
        fields: [watchlistsTable.userId],
        references: [usersTable.id],
    }),

    watchlistCoins: many(watchlistCoinsTable),
}));

export const watchlistCoinsRelations = relations(watchlistCoinsTable, ({ one }) => ({
    watchlist: one(watchlistsTable, {
        fields: [watchlistCoinsTable.watchlistId],
        references: [watchlistsTable.id],
    }),
}));
