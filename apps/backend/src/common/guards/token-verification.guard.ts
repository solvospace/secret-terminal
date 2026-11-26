import TokenService from "../services/token.service.js";
import DatabaseService from "@/database/database.service.js";
import { AppRequest } from "../types/app-request.type.js";
import { refreshTokensTable } from "@/database/schema/index.js";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { eq } from "drizzle-orm";
import type { TokenPayload } from "../types/jwt.types.js";

const sessionExpiredMessage = "Your session has expired. Please sign in again.";

@Injectable()
export class TokenVerification implements CanActivate {
    constructor(
        private readonly db: DatabaseService,
        private readonly tokenService: TokenService,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<AppRequest>();

        const reply = context.switchToHttp().getResponse();

        const refreshToken = request.cookies?.refreshToken;

        if (!refreshToken) {
            throw new UnauthorizedException(sessionExpiredMessage);
        }

        this.tokenService.verify("refreshToken", refreshToken) as TokenPayload;

        try {
            await this.db.query.select().from(refreshTokensTable).where(eq(refreshTokensTable.token, refreshToken));
        } catch {
            throw new UnauthorizedException(sessionExpiredMessage);
        }

        reply.header("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
        reply.header("Pragma", "no-cache");
        reply.header("Expires", "0");

        return true;
    }
}
