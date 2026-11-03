import appConfig from "@secret-terminal/config/app.config";
import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const hostname = request.nextUrl.hostname;
    const pathname = request.nextUrl.pathname;

    const websiteHost = new URL(appConfig.links.website).hostname;
    const appHost = new URL(appConfig.links.app).hostname;

    const websiteDomains = ["localhost", "secretterminal.com", websiteHost];
    const platformDomains = ["app.secretterminal.com", appHost];

    if (pathname.startsWith("/sites") || pathname.startsWith("/platform")) {
        return NextResponse.next();
    }

    const url = request.nextUrl.clone();

    if (websiteDomains.includes(hostname)) {
        url.pathname = `/sites${pathname}`;
        return NextResponse.rewrite(url);
    }

    if (platformDomains.includes(hostname)) {
        url.pathname = `/platform${pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
