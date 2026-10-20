"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { sidebarIconSize } from "@/constants/sidebar.constants";
import { DialogProps } from "@/interfaces/global.interface";
import { useSidebar } from "@/components/ui/sidebar";
import useStSidebar from "@/hooks/use-st-sidebar";
import WatchlistDialog from "../features/watchlist/watchlist-dialog";
import NewsDialog from "../features/news/news-dialog";
import CoinSearchDialog from "../features/coin-search/coin-search-dialog";
import { Spinner } from "../ui/spinner";

export function StSidebar() {
    const { fetchingUser, activeTab, onMenuItemClick, dialogType, showDialog, setShowDialog, menuList } = useStSidebar();
    const { isMobile, toggleSidebar } = useSidebar();

    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarContent id="st-sidebar-content">
                    {fetchingUser ? (
                        <SidebarGroup className="spinner-group">
                            <Spinner className="size-7" />
                        </SidebarGroup>
                    ) : (
                        <SidebarGroup>
                            {menuList.map((menu) => {
                                const Icon = menu.icon;

                                return (
                                    <SidebarMenu key={menu.id}>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                tooltip={menu.name}
                                                disabled={menu.disabled}
                                                isActive={activeTab === menu.value}
                                                style={
                                                    {
                                                        "--sidebar-icon-size": sidebarIconSize,
                                                    } as React.CSSProperties
                                                }
                                            >
                                                <a
                                                    href={menu.externalUrl ?? "#"}
                                                    aria-disabled={menu.disabled}
                                                    onClick={(event) => {
                                                        onMenuItemClick(event, menu.value);
                                                        if (isMobile) toggleSidebar();
                                                    }}
                                                    className={`st-sidebar-menu-button ${menu.disabled && "pointer-events-none"}`}
                                                >
                                                    <Icon className="!size-[var(--sidebar-icon-size)]" />
                                                    {menu.name}
                                                </a>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                );
                            })}
                        </SidebarGroup>
                    )}
                </SidebarContent>

                <SidebarFooter>
                    <SidebarTrigger
                        bindings={{
                            label: "Close sidebar",
                        }}
                    />
                </SidebarFooter>
            </Sidebar>

            {dialogType === "news" && showNewsDialog({ showDialog, setShowDialog })}
            {dialogType === "watchlist" && showWatchlistDialog({ showDialog, setShowDialog })}
            {dialogType === "coin-analysis" && showCoinAnalysisDialog({ showDialog, setShowDialog })}
        </>
    );
}

function showWatchlistDialog({ showDialog, setShowDialog }: DialogProps) {
    return (
        <WatchlistDialog
            showDialog={showDialog}
            setShowDialog={setShowDialog}
        />
    );
}

function showNewsDialog({ showDialog, setShowDialog }: DialogProps) {
    return (
        <NewsDialog
            showDialog={showDialog}
            setShowDialog={setShowDialog}
        />
    );
}

function showCoinAnalysisDialog({ showDialog, setShowDialog }: DialogProps) {
    return (
        <CoinSearchDialog
            showDialog={showDialog}
            setShowDialog={setShowDialog}
        />
    );
}
