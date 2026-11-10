import type { AuthenticatedRequest } from "../../common/types/authenticated-request.type.js";
import type { FastifyReply } from "fastify";

import { RenewToken } from "../../common/guards/renew-token.guard.js";
import { TokenVerification } from "../../common/guards/token-verification.guard.js";
import { handleResponse } from "../../common/utils/api-response.util.js";
import UserService from "./user.service.js";
import { Controller, Get, Req, Res, UseGuards } from "@nestjs/common";

@Controller("users")
@UseGuards(TokenVerification, RenewToken)
export default class UserController {
    constructor(private readonly userService: UserService) {}

    @Get("me")
    async userDetails(@Req() request: AuthenticatedRequest, @Res({ passthrough: true }) reply: FastifyReply) {
        const userId = request.userId;
        const result = await this.userService.retrieveUserDetails(userId);
        return handleResponse(reply, result);
    }
}
