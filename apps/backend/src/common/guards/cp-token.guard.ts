import TokenService from "../services/token.service.js";
import { AppRequest } from "../types/app-request.type.js";
import { Jwt } from "../types/jwt.types.js";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { NodeResponse } from "@nestjs/platform-node";

const sessionExpiredMessage = "Your session has expired. Please sign in again.";

@Injectable()
export class CpTokenGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService) {}

    canActivate(context: ExecutionContext): boolean {
        const http = context.switchToHttp();

        const request = http.getRequest<AppRequest>();
        const reply = http.getResponse<NodeResponse>();

        const cpt = request.cookies?.cpt;

        if (!cpt) {
            throw new UnauthorizedException(sessionExpiredMessage);
        }

        const decodedCpt = this.tokenService.verify("accessToken", cpt) as Jwt;

        if (decodedCpt.error) {
            throw new UnauthorizedException(decodedCpt.error);
        }

        if (decodedCpt.payload.purpose !== process.env.CPT_PURPOSE || !decodedCpt.payload.userId) {
            throw new UnauthorizedException(sessionExpiredMessage);
        }

        reply.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        reply.header("Pragma", "no-cache");
        reply.header("Expires", "0");

        (request as AppRequest).userId = decodedCpt.payload.userId;

        return true;
    }
}
