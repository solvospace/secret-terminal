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

        createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).notNull().defaultNow(),

        updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
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
    (table) => [unique("watchlists_userId_name_key").on(table.userId, table.name)],
);

export const watchlistCoinsTable = watchlistSchema.table(
    "watchlist_coins",
    {
        id: uuid("id")
            .primaryKey()
            .default(sql`uuidv7()`),

        coinId: varchar("coin_id").notNull(),

        name: varchar("name").notNull(),

        symbol: varchar("symbol").notNull(),

        imageUrl: varchar("image_url"),

        createdAt: timestamp("created_at", { precision: 6, withTimezone: true }).notNull().defaultNow(),

        updatedAt: timestamp("updated_at", { precision: 6, withTimezone: true })
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
    (table) => [unique("watchlist_coins_watchlistId_coinId_key").on(table.watchlistId, table.coinId)],
);
