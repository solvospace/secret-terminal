"use client";

import useNavigationTabBar from "@/hooks/use-sidebar";
import NewsDialog from "@/components/features/news/news-dialog";
import WatchlistDialog from "@/components/features/watchlist/watchlist-dialog";
import { Fragment } from "react";
import { Tabs, TabsTrigger, TabsList } from "@/components/ui/tabs";
import { DialogProps } from "@/interfaces/global.interface";
import { iconSize } from "@/constants/app.constants";
import { InteractiveTooltip, InteractiveTooltipContent, InteractiveTooltipTrigger } from "../ui/interactive-tooltip";
import CoinSearchDialog from "../features/coin-search/coin-search-dialog";

type Bindings = {
    onMobile?: boolean;
};

export default function NavigationTabBar(bindings: Bindings) {
    const { onMobile } = bindings;
    const { scrollEnded, activeTab, onTabClick, dialogType, showDialog, setShowDialog, tabList } = useNavigationTabBar();

    return (
        <div className={`navigation-tab-bar`}>
            <Tabs
                className={`${scrollEnded === true && "remove-shadow"}`}
                defaultValue={"home"}
                value={activeTab}
            >
                <TabsList>
                    {tabList.map((tab) => {
                        const Icon = tab.icon;

                        return (
                            <Fragment key={tab.id}>
                                {tab.disabled ? (
                                    <InteractiveTooltip>
                                        <InteractiveTooltipTrigger
                                            render={
                                                <button
                                                    type="button"
                                                    className="tab-disabled"
                                                    aria-label={tab.name}
                                                >
                                                    {onMobile && (
                                                        <Icon
                                                            className="size-[20px]"
                                                            size={iconSize}
                                                        />
                                                    )}

                                                    <div className={`${onMobile && "text-[10px]"}`}>{tab.name}</div>
                                                </button>
                                            }
                                        ></InteractiveTooltipTrigger>

                                        <InteractiveTooltipContent
                                            side="top"
                                            sideOffset={3}
                                            className="!z-[100]"
                                        >
                                            Please sign in to add coins to your watchlist.
                                        </InteractiveTooltipContent>
                                    </InteractiveTooltip>
                                ) : (
                                    <TabsTrigger
                                        value={tab.value}
                                        onClick={(event) => onTabClick(event, tab.value)}
                                        aria-label={tab.name}
                                        className={`${onMobile && "!block"}`}
                                    >
                                        {onMobile && (
                                            <Icon
                                                className="size-[20px]"
                                                size={iconSize}
                                            />
                                        )}

                                        <div className={`${onMobile && "text-[10px] mt-[1px]"}`}>{tab.name}</div>
                                    </TabsTrigger>
                                )}
                            </Fragment>
                        );
                    })}
                </TabsList>
            </Tabs>

            {dialogType === "news" && showNewsDialog({ showDialog, setShowDialog })}
            {dialogType === "watchlist" && showWatchlistDialog({ showDialog, setShowDialog })}
            {dialogType === "coin-analysis" && showCoinAnalysisDialog({ showDialog, setShowDialog })}
        </div>
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
