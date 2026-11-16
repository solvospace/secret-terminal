import { NodeRequest } from "@nestjs/platform-node";

export type AppRequest = NodeRequest & {
    cookies: Record<string, string | undefined>;
    userId: string;
};
