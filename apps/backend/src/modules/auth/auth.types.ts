import { User } from "../user/user.types.js";

type SignUpProperties = {
    name: string;
    email: string;
    password: string;
};

type LoginProperties = {
    email: string;
    password: string;
    cookies: Record<string, string>;
};

type Token = {
    id: string;
    token: string;
    createdAt: Date;
    userId: string;
};

export type { SignUpProperties, LoginProperties, Token };
