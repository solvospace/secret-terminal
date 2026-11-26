import { Injectable } from "@nestjs/common";
import { drizzle, NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema/index.js";

@Injectable()
export default class DatabaseService {
    private readonly pool: Pool;
    readonly query: NodePgDatabase<typeof schema>;

    constructor() {
        this.pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });

        this.query = drizzle(this.pool, { schema });
    }

    async onModuleInit() {
        await this.pool.query("SELECT 1");
        console.log("Database connected!");
    }

    async onApplicationShutdown() {
        await this.pool.end();
    }
}
