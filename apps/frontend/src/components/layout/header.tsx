"use client";

import Link from "next/link";
import useHeader from "@/hooks/use-header";
import AccountCentre from "@/components/features/account/account-centre";
import CoinSearchDialog from "@/components/features/coin-search/coin-search-dialog";
import { iconSize } from "@/constants/app.constants";
import { Search } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { ThemeToggle } from "../ui/theme-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import { useSidebar } from "../ui/sidebar";

export default function Header() {
    const { showSearchDialog, setShowSearchDialog } = useHeader();
    const { isMobile } = useSidebar();

    return (
        <>
            <div className={`header-container`}>
                <div className="navbar">
                    <div className="left-side-container">
                        {isMobile && (
                            <SidebarTrigger
                                className={`!pl-[unset]`}
                                showMenuIcon={true}
                            />
                        )}
                        <Link
                            href="/"
                            className={`${isMobile && "ml-[-8px]"} logo`}
                        >
                            secret<span className="text-[var(--main-color)] text-[25px]">_</span>terminal
                        </Link>
                    </div>

                    <div className="header-right-side-container">
                        <Search
                            className="cursor-pointer"
                            size={iconSize}
                            onClick={() => {
                                setShowSearchDialog(true);
                            }}
                        />

                        <AccountCentre />

                        <div className="divider"></div>

                        <a
                            href="https://github.com/shubhamtak007/secret-terminal"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="View Secret Terminal on GitHub"
                        >
                            <FiGithub size={iconSize} />
                        </a>

                        <ThemeToggle />
                    </div>
                </div>
            </div>

            <CoinSearchDialog
                showDialog={showSearchDialog}
                setShowDialog={setShowSearchDialog}
            />
        </>
    );
}
