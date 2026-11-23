import AuthenticationService from "../../modules/auth/auth.service.js";
import TokenService from "../services/token.service.js";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { NodeResponse } from "@nestjs/platform-node";
import type { AppRequest } from "../types/app-request.type.js";
import type { Jwt } from "../types/jwt.types.js";

@Injectable()
export class RenewToken implements CanActivate {
    constructor(
        private readonly authService: AuthenticationService,
        private readonly tokenService: TokenService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();

        const request = http.getRequest<AppRequest>();
        const reply = http.getResponse<NodeResponse>();

        const refreshToken = request.cookies?.refreshToken;
        const accessToken = request.cookies?.accessToken;

        if (!refreshToken) {
            throw new UnauthorizedException("Your session has expired. Please sign in again.");
        }

        const decodedRt = this.tokenService.verify("refreshToken", refreshToken) as Jwt;

        if (decodedRt.error) {
            throw new UnauthorizedException("Your session has expired. Please sign in again.");
        }

        const userId = decodedRt.payload.userId;

        const decodedAt = accessToken ? (this.tokenService.verify("accessToken", accessToken) as Jwt) : null;

        const accessTokenInvalid = !decodedAt || "error" in decodedAt;

        if (accessTokenInvalid) {
            const tokens = await this.authService.manageTokens(userId, refreshToken);

            this.authService.clearAuthCookies(reply);
            this.authService.setAuthCookies(reply, tokens);
        }

        request.userId = userId;

        return true;
    }
}
