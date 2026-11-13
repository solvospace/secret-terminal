import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { describe, it, expect, vi, beforeEach } from "vitest";

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
            const reply = {
                status: vi.fn().mockReturnThis(),
                send: vi.fn(),
            } as any;

            appController.healthCheck(reply);

            expect(reply.status).toHaveBeenCalledWith(HttpStatus.OK);
            expect(reply.send).toHaveBeenCalled();
        });
    });
});
