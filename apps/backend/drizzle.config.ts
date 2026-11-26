import { defineConfig } from "drizzle-kit";
import "./src/load-env.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
    throw new Error("DATABASE_URL is not configured");
}

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/database/schema/*",
    out: "./src/database/migrations",
    dbCredentials: {
        url: databaseUrl,
    },
    tablesFilter: ["!_prisma_migrations"],
});
