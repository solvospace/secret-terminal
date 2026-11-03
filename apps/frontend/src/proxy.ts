import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
    const hostname = request.nextUrl.hostname;
    const pathname = request.nextUrl.pathname;

    if (pathname.startsWith("/sites") || pathname.startsWith("/platform")) {
        return NextResponse.next();
    }

    const url = request.nextUrl.clone();

    if (hostname === "localhost" || hostname === "secretterminal.com" || hostname === "www.secretterminal.com") {
        url.pathname = `/sites${pathname}`;
        return NextResponse.rewrite(url);
    }

    if (hostname === "app.secretterminal.com") {
        url.pathname = `/platform${pathname}`;
        return NextResponse.rewrite(url);
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|api).*)"],
};
