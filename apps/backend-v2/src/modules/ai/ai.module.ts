import AiController from "./ai.controller.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [AiController],
})
export default class AiModule {}
