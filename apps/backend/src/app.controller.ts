import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class AppController {
    @Get()
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
