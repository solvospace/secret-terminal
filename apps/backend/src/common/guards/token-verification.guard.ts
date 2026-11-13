import TokenService from "../services/token.service.js";
import { PrismaService } from "../../prisma/prisma.service.js";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import type { Jwt } from "../types/jwt.types.js";
import type { FastifyRequest } from "fastify";

const sessionExpiredMessage = "Your session has expired. Please sign in again.";

@Injectable()
export class TokenVerification implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        const reply = context.switchToHttp().getResponse();

        const refreshToken = request.cookies.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException(sessionExpiredMessage);
        }

        const decodedRt = TokenService.verifyRefreshToken(refreshToken) as Jwt;

        if (decodedRt.error) {
            throw new UnauthorizedException(sessionExpiredMessage);
        }

        const storedToken = await this.prisma.refreshToken.findUnique({
            where: {
                token: refreshToken,
            },
        });

        if (!storedToken) {
            throw new UnauthorizedException(sessionExpiredMessage);
        }

        reply.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        reply.header("Pragma", "no-cache");
        reply.header("Expires", "0");

        return true;
    }
}
