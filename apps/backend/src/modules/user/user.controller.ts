import UserService from "./user.service.js";
import { RenewToken } from "../../common/guards/renew-token.guard.js";
import { TokenVerification } from "../../common/guards/token-verification.guard.js";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import type { AppRequest } from "../../common/types/app-request.type.js";

@Controller("users")
@UseGuards(TokenVerification, RenewToken)
export default class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("me")
    async userDetails(@Req() request: AppRequest) {
        const userId = request.userId;
        return await this.userService.retrieveUserDetails(userId);
    }
}
