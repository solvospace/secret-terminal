import type { NextConfig } from "next";
const isProduction = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
    cacheComponents: true,
    partialPrefetching: true,

    compiler: {
        removeConsole: isProduction && {
            exclude: ["error", "warn", "info"],
        },
    },

    reactCompiler: true,
    typedRoutes: true,

    devIndicators: false,
    productionBrowserSourceMaps: false,
    reactStrictMode: false,
};

export default nextConfig;
