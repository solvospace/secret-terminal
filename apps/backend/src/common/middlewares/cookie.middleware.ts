import { AppRequest } from "../types/app-request.type.js";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { parseCookie } from "cookie";
import type { NodeRequest, NodeResponse } from "@nestjs/platform-node";

@Injectable()
export default class CookieMiddleware implements NestMiddleware {
    use(req: NodeRequest, res: NodeResponse, next: () => void) {
        (req as AppRequest).cookies = parseCookie(req.headers.cookie ?? "");

        next();
    }
}
