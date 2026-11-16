import { AppRequest } from "../types/app-request.type.js";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NodeResponse } from "@nestjs/platform-node";
import { parseCookie } from "cookie";

@Injectable()
export default class CookieMiddleware implements NestMiddleware {
    use(request: AppRequest, response: NodeResponse, next: () => void) {
        request.cookies = parseCookie(request.headers.cookie ?? "");
        next();
    }
}
