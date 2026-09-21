"use client";

import Link from "next/link";
import useHeader from "@/hooks/use-header";
import AccountCentre from "@/components/features/account/account-centre";
import CoinSearchDialog from "@/components/features/coin-search/coin-search-dialog";
import { iconSize } from "@/constants/app.constants";
import { Search, Terminal } from "lucide-react";
import { FiGithub } from "react-icons/fi";
import { ThemeToggle } from "../ui/theme-toggle";

export default function Header() {
    const { scrolled, showSearchDialog, setShowSearchDialog } = useHeader();

    return (
        <>
            <div className={`header-container ${scrolled ? "with-shadow" : ""}`}>
                <div className="navbar">
                    <Link
                        href="/"
                        className="logo"
                    >
                        secret <Terminal strokeWidth={3} />
                    </Link>

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
