import { type JwtPayload } from "jsonwebtoken";

type TokenPayload = JwtPayload & {
    userId: string;
    purpose?: string;
};

type Jwt = {
    payload: TokenPayload;
    error: string;
};

type JwtError = {
    name: string;
    message: string;
    expiredAt: number;
};

export type { Jwt, TokenPayload, JwtError };
