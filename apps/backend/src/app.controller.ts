import { Controller, Get } from "@nestjs/common";
import { SkipThrottle } from "@nestjs/throttler";

@Controller("health")
export class AppController {
    @Get()
    @SkipThrottle()
    healthCheck() {
        return {
            message: "Application is healthy.",
            data: {
                uptime: process.uptime(),
                timestamp: new Date().toISOString(),
            },
        };
    }
}
