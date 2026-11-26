import { defineConfig } from "drizzle-kit";
import "@/load-env.js";

export default defineConfig({
    dialect: "postgresql",
    schema: "./src/database/schema/*",
    out: "./src/database/migrations",
    dbCredentials: {
        url: process.env.DATABASE_URL!,
    },
});
