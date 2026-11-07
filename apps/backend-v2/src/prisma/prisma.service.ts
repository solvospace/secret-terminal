import { PrismaClient } from "../../prisma/generated/client.js";
import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { Logger } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(PrismaService.name);

    constructor() {
        const adapter = new PrismaPg({
            connectionString: process.env.DATABASE_URL!,
        });

        super({ adapter });
    }

    async onModuleInit() {
        await this.$connect();
        this.logger.log("Database Connected.");
    }

    async onModuleDestroy() {
        await this.$disconnect();
        this.logger.log("Failed to connect.");
    }
}
