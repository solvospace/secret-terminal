import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
    return [
        {
            url: "https://www.secretterminal.com",
            lastModified: new Date("2026-10-17"),
        },
    ];
}
