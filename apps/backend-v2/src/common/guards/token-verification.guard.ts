import type { Jwt } from "../types/jwt.types.js";
import type { FastifyRequest } from "fastify";

import { PrismaService } from "../../prisma/prisma.service.js";
import { AppException } from "../exceptions/app.exception.js";
import TokenService from "../services/token.service.js";
import { CanActivate, ExecutionContext, HttpStatus, Injectable } from "@nestjs/common";

const sessionExpiredMessage = "Your session has expired. Please sign in again.";

@Injectable()
export class TokenVerificationGuard implements CanActivate {
    constructor(private readonly prisma: PrismaService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<FastifyRequest>();

        const reply = context.switchToHttp().getResponse();

        const refreshToken = request.cookies.refreshToken;

        if (!refreshToken) {
            throw new AppException({
                message: sessionExpiredMessage,
                cause: {
                    status: HttpStatus.UNAUTHORIZED,
                },
            });
        }

        const decodedRt = TokenService.verifyRefreshToken(refreshToken) as Jwt;

        if (decodedRt.error) {
            throw new AppException({
                message: sessionExpiredMessage,
                cause: {
                    status: HttpStatus.UNAUTHORIZED,
                },
            });
        }

        const storedToken = await this.prisma.refreshToken.findUnique({
            where: {
                token: refreshToken,
            },
        });

        if (!storedToken) {
            throw new AppException({
                message: sessionExpiredMessage,
                cause: {
                    status: HttpStatus.UNAUTHORIZED,
                },
            });
        }

        reply.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        reply.header("Pragma", "no-cache");
        reply.header("Expires", "0");

        return true;
    }
}
