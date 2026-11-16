import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, expect, beforeEach } from "vitest";

describe("AppController", () => {
    let appController: AppController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [AppController],
            providers: [AppService],
        }).compile();

        appController = app.get<AppController>(AppController);
    });

    describe("root", () => {
        it("should return healthy status.", () => {
            expect(appController.healthCheck()).toHaveProperty("message", "Application is healthy.");
        });
    });
});
