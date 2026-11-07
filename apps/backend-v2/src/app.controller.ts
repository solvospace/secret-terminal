import { AppService } from "./app.service.js";
import { Controller, Get } from "@nestjs/common";

@Controller({ path: "health", version: "1" })
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    getHealth(): string {
        return this.appService.getHealthDetails();
    }
}
