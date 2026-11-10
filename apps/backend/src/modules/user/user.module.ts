import { RenewToken } from "../../common/guards/renew-token.guard.js";
import { TokenVerification } from "../../common/guards/token-verification.guard.js";
import AuthenticationModule from "../auth/auth.module.js";
import UserController from "./user.controller.js";
import UserService from "./user.service.js";
import { Module } from "@nestjs/common";

@Module({
    imports: [AuthenticationModule],
    controllers: [UserController],
    providers: [UserService, TokenVerification, RenewToken],
})
export default class UserModule {}
