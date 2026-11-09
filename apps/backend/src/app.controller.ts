import type { FastifyReply } from "fastify";

import { Controller, Get, HttpStatus, Res } from "@nestjs/common";

@Controller({ path: "health", version: "1" })
export class AppController {
    @Get()
    healthCheck(@Res() reply: FastifyReply) {
        return reply.status(HttpStatus.OK).send({
            success: true,
            message: "Application is healthy.",
            data: {
                status: "ok",
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            },
        });
    }
}
