import UserController from "./user.controller.js";
import UserService from "./user.service.js";
import { Module } from "@nestjs/common";

@Module({
    controllers: [UserController],
    providers: [UserService],
})
export default class UserModule {}
