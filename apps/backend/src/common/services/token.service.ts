import jwt from "jsonwebtoken";
import { TokenPayload } from "../types/jwt.types.js";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import type { StringValue } from "ms";

type TokenType = "accessToken" | "refreshToken";

@Injectable()
export default class TokenService {
    generate(type: TokenType, payload: TokenPayload): string {
        const secret = this.getSecret(type);
        let expiresIn;

        switch (type) {
            case "accessToken":
                expiresIn = process.env.ACCESS_TOKEN_EXPIRES_IN;
                break;
            case "refreshToken":
                expiresIn = process.env.REFRESH_TOKEN_EXPIRES_IN;
                break;
        }

        if (!expiresIn) {
            throw new Error(`${type} expiration is not configured.`);
        }

        return jwt.sign(payload, secret, {
            expiresIn: expiresIn as StringValue,
            algorithm: "HS256",
        });
    }

    verify(type: TokenType, token: string) {
        const secret = this.getSecret(type);

        try {
            return jwt.verify(token, secret, {
                algorithms: ["HS256"],
            });
        } catch {
            throw new UnauthorizedException("Invalid or expired token.");
        }
    }

    private getSecret(type: TokenType): string {
        let secret: string | undefined;

        switch (type) {
            case "accessToken":
                secret = process.env.JWT_ACCESS_TOKEN_SECRET;
                break;
            case "refreshToken":
                secret = process.env.JWT_REFRESH_TOKEN_SECRET;
                break;
        }

        if (!secret) {
            throw new Error(`${type} secret is not configured.`);
        }

        return secret;
    }
}
