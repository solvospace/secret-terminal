import { usersTable } from "../auth/auth.schema.js";
import { sql } from "drizzle-orm";
import { pgSchema, uuid, varchar, timestamp, unique } from "drizzle-orm/pg-core";

export const watchlistSchema = pgSchema("watchlist");

export const watchlistsTable = watchlistSchema.table(
    "watchlists",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`uuidv7()`),

        name: varchar("name").notNull().unique(),

        description: varchar("description"),

        createdAt: timestamp("created_at", { precision: 6 }).notNull().defaultNow(),

        updatedAt: timestamp("updated_at", { precision: 6 })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),

        userId: uuid("user_id")
            .notNull()
            .references(() => usersTable.id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
    },
    (table) => [unique("watchlists_user_id_name_unique").on(table.userId, table.name)],
);

export const watchlistCoinsTable = watchlistSchema.table(
    "watchlist_coins",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`uuidv7()`),

        coinId: varchar("coinId").notNull(),

        name: varchar("name").notNull(),

        symbol: varchar("symbol").notNull(),

        imageUrl: varchar("imageUrl"),

        createdAt: timestamp("created_at", { precision: 6 }).notNull().defaultNow(),

        updatedAt: timestamp("updated_at", { precision: 6 })
            .notNull()
            .defaultNow()
            .$onUpdate(() => new Date()),

        watchlistId: uuid("watchlist_id")
            .notNull()
            .references(() => watchlistsTable.id, {
                onDelete: "cascade",
                onUpdate: "cascade",
            }),
    },
    (table) => [unique("watchlist_coins_watchlist_id_coin_id_unique").on(table.watchlistId, table.coinId)],
);
