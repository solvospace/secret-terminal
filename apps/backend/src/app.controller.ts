import { Controller, Get, HttpStatus, Res } from "@nestjs/common";
import type { FastifyReply } from "fastify";

@Controller("health")
export class AppController {
    @Get()
    healthCheck(@Res({ passthrough: true }) reply: FastifyReply) {
        return reply.status(HttpStatus.OK).send({
            success: true,
            message: "Application is healthy.",
            data: {
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            },
        });
    }
}
