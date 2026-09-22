"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { iconSize } from "@/constants/app.constants";
import useSidebar from "@/hooks/use-st-sidebar";
import WatchlistDialog from "../features/watchlist/watchlist-dialog";
import NewsDialog from "../features/news/news-dialog";
import { DialogProps } from "@/interfaces/global.interface";
import CoinSearchDialog from "../features/coin-search/coin-search-dialog";

export function StSidebar() {
    const { scrollEnded, activeTab, onMenuItemClick, dialogType, showDialog, setShowDialog, tabList } = useSidebar();

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
                                            isActive={activeTab === tab.value}
                                            onClick={(event) => onMenuItemClick(event, tab.value)}
                                        >
                                            <Icon
                                                className="size-[20px]"
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
