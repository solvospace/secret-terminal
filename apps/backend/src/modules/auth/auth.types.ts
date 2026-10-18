import { User } from "../user/user.types.js";

type SignUpProperties = {
    name: string;
    email: string;
    password: string;
};

type SignInProperties = {
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

export type { SignUpProperties, SignInProperties, Token };
