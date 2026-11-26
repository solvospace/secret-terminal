import { watchlistsTable } from "./../watchlist/watchlist.schema.js";
import { usersTable, refreshTokensTable, resetCodesTable } from "./auth.schema.js";
import { relations } from "drizzle-orm";

export const usersRelations = relations(usersTable, ({ many }) => ({
    refreshTokens: many(refreshTokensTable),
    resetCodes: many(resetCodesTable),
    watchlist: many(watchlistsTable),
}));

export const refreshTokensRelations = relations(refreshTokensTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [refreshTokensTable.userId],
        references: [usersTable.id],
    }),
}));

export const resetCodesRelations = relations(resetCodesTable, ({ one }) => ({
    user: one(usersTable, {
        fields: [resetCodesTable.userId],
        references: [usersTable.id],
    }),
}));
