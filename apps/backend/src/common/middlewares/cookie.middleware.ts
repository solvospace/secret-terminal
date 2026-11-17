import { AppRequest } from "../types/app-request.type.js";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NodeResponse } from "@nestjs/platform-node";

@Injectable()
export default class CookieMiddleware implements NestMiddleware {
    use(request: AppRequest, response: NodeResponse, next: () => void) {
        request.cookies = this.parseCookies(request.headers?.cookie);
        next();
    }

    private parseCookies(headerCookie: string | undefined) {
        const cookies: Record<string, string> = {};
        if (!headerCookie) return cookies;

        headerCookie.split(";").forEach((cookie) => {
            const [name, ...rest] = cookie.split("=");
            const key = name?.trim();
            if (!key) return;

            const value = rest.join("=").trim();
            cookies[key] = value;
        });

        return cookies;
    }
}
