"use client";

import { appSettings } from "@/constants/settings.constants";

export default function Home() {
    return (
        <section className="flex h-[calc(100vh-100px)] flex-col items-center justify-center p-8 text-center">
            <h1 className="mb-4 text-4xl font-bold sm:text-7xl">
                secret<span className="ml-[8px] text-[var(--main-color)] text-[40px]">_</span>terminal
            </h1>

            <button
                className="go-to-terminal-btn"
                onClick={(event) => {
                    event?.preventDefault();
                    window.open(appSettings.links.website);
                }}
            >
                Go to Terminal
            </button>
        </section>
    );
}
