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
import { iconSize, sidebarIconSize } from "@/constants/app.constants";
import useStSidebar from "@/hooks/use-st-sidebar";
import WatchlistDialog from "../features/watchlist/watchlist-dialog";
import NewsDialog from "../features/news/news-dialog";
import { DialogProps } from "@/interfaces/global.interface";
import CoinSearchDialog from "../features/coin-search/coin-search-dialog";
import { useSidebar } from "@/components/ui/sidebar";

export function StSidebar() {
    const { activeTab, onMenuItemClick, dialogType, showDialog, setShowDialog, menuList } = useStSidebar();
    const { isMobile, toggleSidebar } = useSidebar();

    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarContent>
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
                                            onClick={(event) => {
                                                onMenuItemClick(event, menu.value);
                                                if (isMobile) toggleSidebar();
                                            }}
                                            style={
                                                {
                                                    "--sidebar-icon-size": sidebarIconSize,
                                                } as React.CSSProperties
                                            }
                                        >
                                            <Icon
                                                className="!size-[var(--sidebar-icon-size)]"
                                                size={iconSize}
                                            />
                                            {menu.name}
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>
                            );
                        })}
                    </SidebarGroup>
                </SidebarContent>

                <SidebarFooter>
                    <SidebarTrigger
                        bindings={{
                            label: "Collapse menu",
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
