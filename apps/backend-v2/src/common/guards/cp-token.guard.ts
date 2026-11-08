import TokenService from "../services/token.service.js";
import { AuthenticatedRequest } from "../types/authenticated-request.type.js";
import { Jwt } from "../types/jwt.types.js";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { FastifyRequest, FastifyReply } from "fastify";

@Injectable()
export class CpTokenGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const http = context.switchToHttp();

        const request = http.getRequest<FastifyRequest>();
        const reply = http.getResponse<FastifyReply>();

        const cpt = request.cookies?.cpt;

        if (!cpt) {
            throw new UnauthorizedException("Your session has expired. Please try again.");
        }

        const decodedCpt = TokenService.verifyAccessToken(cpt) as Jwt;

        if (decodedCpt.error) {
            throw new UnauthorizedException(decodedCpt.error);
        }

        if (decodedCpt.payload.purpose !== "change-password" || !decodedCpt.payload.userId) {
            throw new UnauthorizedException("Your session has expired. Please try again.");
        }

        reply.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        reply.header("Pragma", "no-cache");
        reply.header("Expires", "0");

        (request as AuthenticatedRequest).userId = decodedCpt.payload.userId;

        return true;
    }
}
