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
    const { activeTab, onMenuItemClick, dialogType, showDialog, setShowDialog, tabList } = useStSidebar();
    const { isMobile, toggleSidebar } = useSidebar();

    return (
        <>
            <Sidebar collapsible="icon">
                <SidebarContent>
                    <SidebarGroup>
                        {tabList.map((tab) => {
                            const Icon = tab.icon;

                            return (
                                <SidebarMenu key={tab.id}>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            tooltip={tab.name}
                                            disabled={tab.disabled}
                                            isActive={activeTab === tab.value}
                                            onClick={(event) => {
                                                onMenuItemClick(event, tab.value);
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
                                            {tab.name}
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
