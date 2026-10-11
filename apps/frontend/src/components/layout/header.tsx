"use client";

import Link from "next/link";
import useHeader from "@/hooks/use-header";
import AccountCentre from "@/components/features/account/account-centre";
import CoinSearchDialog from "@/components/features/coin-search/coin-search-dialog";
import { iconSize } from "@/constants/app.constants";
import { Search } from "lucide-react";
import { ThemeToggle } from "../ui/theme-toggle";
import { SidebarTrigger } from "../ui/sidebar";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";

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
                                className={`!pl-[unset] !pr-[unset]`}
                                bindings={{
                                    showMenuIcon: true,
                                }}
                            />
                        )}

                        <Link
                            href="/"
                            className={`logo`}
                        >
                            secret<span className="text-[var(--main-color)] text-[25px]">_</span>terminal
                        </Link>
                    </div>

                    {!isMobile && (
                        <div className="search-bar">
                            <Button
                                variant={"outline"}
                                onClick={() => {
                                    setShowSearchDialog(true);
                                }}
                            >
                                <Search className="size-4 mr-[4px]" />
                                Search by name...
                            </Button>
                        </div>
                    )}

                    <div className="right-side-container">
                        {isMobile && (
                            <Search
                                className="cursor-pointer"
                                size={iconSize}
                                onClick={() => {
                                    setShowSearchDialog(true);
                                }}
                            />
                        )}

                        <ThemeToggle />

                        <AccountCentre />
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
