import AuthenticationService from "../../modules/auth/auth.service.js";
import TokenService from "../services/token.service.js";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { AuthenticatedRequest } from "../types/authenticated-request.type.js";
import type { Jwt } from "../types/jwt.types.js";
import type { FastifyReply } from "fastify";

@Injectable()
export class RenewToken implements CanActivate {
    constructor(private readonly authService: AuthenticationService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const http = context.switchToHttp();

        const request = http.getRequest<AuthenticatedRequest>();
        const reply = http.getResponse<FastifyReply>();

        const refreshToken = request.cookies?.refreshToken;
        const accessToken = request.cookies?.accessToken;

        if (!refreshToken) {
            throw new UnauthorizedException("Your session has expired. Please sign in again.");
        }

        const decodedRt = TokenService.verifyRefreshToken(refreshToken) as Jwt;

        if (decodedRt.error) {
            throw new UnauthorizedException("Your session has expired. Please sign in again.");
        }

        const userId = decodedRt.payload.userId;

        const decodedAt = accessToken ? (TokenService.verifyAccessToken(accessToken) as Jwt) : null;

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
