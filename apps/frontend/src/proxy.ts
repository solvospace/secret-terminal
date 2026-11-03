import { rootDomain } from "@/lib/utils";
import { type NextRequest, NextResponse } from "next/server";

function extractSubdomain(request: NextRequest): string | null {
    const hostHeader = request.headers.get("host") || "";

    const hostname = hostHeader.split(":")[0];

    if (hostname.endsWith(".localhost")) {
        return hostname.replace(".localhost", "");
    }

    if (hostname === "localhost" || hostname === "127.0.0.1") {
        return null;
    }

    const rootDomainFormatted = rootDomain.split(":")[0];

    if (hostname.includes("---") && hostname.endsWith(".vercel.app")) {
        return hostname.split("---")[0] || null;
    }

    const isSubdomain =
        hostname !== rootDomainFormatted &&
        hostname !== `www.${rootDomainFormatted}` &&
        hostname.endsWith(`.${rootDomainFormatted}`);

    return isSubdomain ? hostname.replace(`.${rootDomainFormatted}`, "") : null;
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const subdomain = extractSubdomain(request);

    if (!subdomain) {
        return NextResponse.next();
    }

    if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    const url = request.nextUrl.clone();
    url.pathname = `/s/${subdomain}${pathname}`;

    return NextResponse.rewrite(url);
}

export const config = {
    matcher: ["/((?!api|_next|[\\w-]+\\.\\w+).*)"],
};
