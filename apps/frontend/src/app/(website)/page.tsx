"use client";

import { Button } from "@/components/ui/button";
import appConfig from "@secret-terminal/config/app.config";

export default function Home() {
    return (
        <section className="flex h-[calc(100vh-100px)] flex-col items-center justify-center p-8 text-center">
            <h1 className="mb-2 text-4xl font-bold sm:text-7xl">
                secret<span className="ml-[8px] text-[var(--main-color)] text-[40px]">_</span>terminal
            </h1>

            <div className="mb-4 text-sm">{appConfig.app.description}</div>

            <Button
                className="!text-[14px]"
                size="sm"
                onClick={(event) => {
                    event?.preventDefault();
                    window.location.assign(appConfig.links.app);
                }}
            >
                Go to Terminal
            </Button>
        </section>
    );
}
