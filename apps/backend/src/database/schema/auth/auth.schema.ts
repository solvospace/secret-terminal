import { sql } from "drizzle-orm";
import { pgSchema, uuid, varchar, boolean, timestamp } from "drizzle-orm/pg-core";

export const authSchema = pgSchema("auth");

export const usersTable = authSchema.table("users", {
    id: uuid("id")
        .primaryKey()
        .default(sql`uuidv7()`),
    name: varchar("name").notNull(),
    email: varchar("email").notNull().unique(),
    password: varchar("password").notNull(),
    createdAt: timestamp("created_at", { precision: 6 }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { precision: 6 })
        .notNull()
        .defaultNow()
        .$onUpdate(() => new Date()),
    verified: boolean("verified").notNull().default(false),
    verificationCode: varchar("verification_code").unique(),
    verificationCodeExpiresAt: timestamp("verification_code_expires_at", { precision: 6 }).default(
        sql`(now() + interval '10 minutes')`,
    ),
});

export const refreshTokensTable = authSchema.table("refresh_tokens", {
    id: uuid("id")
        .primaryKey()
        .default(sql`uuidv7()`),
    token: varchar("token").notNull().unique(),
    createdAt: timestamp("created_at", { precision: 6 }).notNull().defaultNow(),
    userId: uuid("user_id")
        .notNull()
        .references(() => usersTable.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
});

export const resetCodesTable = authSchema.table("reset_codes", {
    id: uuid("id")
        .primaryKey()
        .default(sql`uuidv7()`),
    code: varchar("code").notNull().unique(),
    createdAt: timestamp("created_at", { precision: 6 }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { precision: 6 })
        .notNull()
        .default(sql`(now() + interval '15 minutes')`),
    userId: uuid("user_id")
        .notNull()
        .references(() => usersTable.id, {
            onDelete: "cascade",
            onUpdate: "cascade",
        }),
});
