import type { AuthenticatedRequest } from "../../common/types/authenticated-request.type.js";

import { RenewToken } from "../../common/guards/renew-token.guard.js";
import { TokenVerification } from "../../common/guards/token-verification.guard.js";
import UserService from "./user.service.js";
import { Controller, Get, Req, UseGuards } from "@nestjs/common";

@Controller("users")
@UseGuards(TokenVerification, RenewToken)
export default class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("me")
    async userDetails(@Req() request: AuthenticatedRequest) {
        const userId = request.userId;
        return await this.userService.retrieveUserDetails(userId);
    }
}
