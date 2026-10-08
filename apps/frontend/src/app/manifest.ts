import { MetadataRoute } from "next";
import appConfig from "@secret-terminal/config/app.config";

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: appConfig.app.name,
        short_name: appConfig.app.name,
        description: appConfig.app.description,
        theme_color: "#ffffff",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "any",
        start_url: "/",
        icons: [
            {
                src: "/icon-192x192.png",
                sizes: "192x192",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon-512x512.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
            {
                src: "/icon.svg",
                type: "image/svg+xml",
                sizes: "any",
                purpose: "any",
            },
        ],
    };
}
