import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";
import { Pool } from "pg";
import "@/load-env.js";

async function testMigration() {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const db = drizzle(pool);

    try {
        await migrate(db, { migrationsFolder: "./src/database/migrations" });
        console.log("Migrations completed successfully");
    } catch (err) {
        console.error("Migration failed with error:", err);
    } finally {
        await pool.end();
    }
}

await testMigration();
