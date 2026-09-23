"use client";

import Link from "next/link";
import { LuGithub } from "react-icons/lu";
import { ThemeToggle } from "../ui/theme-toggle";
import { appSettings } from "@/constants/settings.constants";

export default function Header() {
    return (
        <nav
            className={`bg-opacity-5 sticky top-0 z-50 mx-auto flex h-[50px] w-full items-center justify-between
                border-b border-[var(--border-color)] backdrop-blur-xl backdrop-filter gap-2 px-5`}
        >
            <div className="flex items-center font-semibold">
                secret<span className="text-[var(--main-color)] text-[25px]">_</span>terminal
            </div>

            <div className="flex gap-3 sm:ml-0">
                <Link
                    aria-label="View the repository on GitHub"
                    href={appSettings.links.github}
                    rel="noopener noreferrer"
                    target="_blank"
                    title="View the repository on GitHub"
                >
                    <LuGithub className="size-5" />
                </Link>

                <ThemeToggle />
            </div>
        </nav>
    );
}
