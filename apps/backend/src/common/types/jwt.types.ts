type JwtPayload = {
    userId: string;
    purpose: string;
};

type Jwt = {
    payload: JwtPayload;
    error: string;
};

type JwtError = {
    name: string;
    message: string;
    expiredAt: number;
};

export type { Jwt, JwtPayload, JwtError };
