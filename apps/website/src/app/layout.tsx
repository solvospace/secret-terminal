import type { Metadata } from "next";
import "./globals.scss";
import { Inter } from "next/font/google";
import type { Viewport } from "next";
import { ThemeProvider } from "@/contexts/theme-context";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({
    weight: ["400", "500", "600", "700", "800", "900"],
    subsets: ["latin"],
    display: "swap",
});

export const metadata: Metadata = {
    title: "Secret Terminal",
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html lang="en">
            <body className={`${inter.className}`}>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                >
                    {children}
                </ThemeProvider>

                <Analytics />
            </body>
        </html>
    );
}
