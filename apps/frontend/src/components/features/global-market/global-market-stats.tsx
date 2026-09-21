"use client";

import useGlobalMarketStats from "@/hooks/use-global-market-stats";
import { formatValueInUsdCompact, roundOffNumber } from "@secret-terminal/services/utils.service";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { Spinner } from "@/components/ui/spinner";
import { useSidebar } from "@/components/ui/sidebar";
import { sidebarWidth } from "@/constants/app.constants";

function GlobalMarketStats() {
    const { globalMarketStats, fetchingGlobalMarketStats, scrollReachedBottom } = useGlobalMarketStats();
    const { open } = useSidebar();

    return (
        <div
            style={
                {
                    "--sidebar-width": sidebarWidth,
                } as React.CSSProperties
            }
            className={`global-market-stats-bottom-bar ${scrollReachedBottom === true && "remove-shadow"}
                        ${open && "!w-[calc(100vw_-_var(--sidebar-width))]"}
                    `}
        >
            {fetchingGlobalMarketStats ? (
                <Spinner className="m-[auto] size-5" />
            ) : (
                <div className="inner-wrapper">
                    {globalMarketStats.totalCoins && (
                        <div className="pair-container">
                            <div className="name">Total Coins:</div>

                            <div className="value">{globalMarketStats.totalCoins}</div>
                        </div>
                    )}

                    {globalMarketStats.exchanges && (
                        <div className="pair-container">
                            <div className="name">Exchanges:</div>

                            <div className="value">{globalMarketStats.exchanges}</div>
                        </div>
                    )}

                    {globalMarketStats.totalMarketCapital && (
                        <div className="pair-container">
                            <div className="name">Market Cap:</div>

                            <div className="value flex items-center">
                                {formatValueInUsdCompact(globalMarketStats.totalMarketCapital.value, 3)}

                                {globalMarketStats.marketCapitalChangePercentage24hUsd && (
                                    <div
                                        className={`ml-[6px] flex items-center ${globalMarketStats.marketCapitalChangePercentage24hUsd > 0 ? "success-text" : "danger-text"}`}
                                    >
                                        <span className="relative bottom-[1px]">
                                            {globalMarketStats.marketCapitalChangePercentage24hUsd > 0 ? (
                                                <FaCaretUp />
                                            ) : (
                                                <FaCaretDown />
                                            )}
                                        </span>
                                        {roundOffNumber(globalMarketStats.marketCapitalChangePercentage24hUsd, 2) + "%"}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {globalMarketStats.totalVolume && (
                        <div className="pair-container">
                            <div className="name">24h Vol:</div>

                            <div className="value flex items-center">
                                {formatValueInUsdCompact(globalMarketStats.totalVolume, 3)}

                                {globalMarketStats.volumeChangePercentage24hUsd && (
                                    <div
                                        className={`ml-[6px] flex items-center ${globalMarketStats.volumeChangePercentage24hUsd > 0 ? "success-text" : "danger-text"}`}
                                    >
                                        <span className="relative bottom-[1px]">
                                            {globalMarketStats.volumeChangePercentage24hUsd > 0 ? (
                                                <FaCaretUp />
                                            ) : (
                                                <FaCaretDown />
                                            )}
                                        </span>
                                        {roundOffNumber(globalMarketStats.volumeChangePercentage24hUsd, 2) + "%"}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {globalMarketStats.totalMarketCapital && (
                        <div className="pair-container">
                            <div className="name">Dominance:</div>

                            <div className="value">
                                {globalMarketStats.totalMarketCapital.marketCapShareList
                                    .slice(0, 3)
                                    .map((marketCapShareItem, index) => {
                                        return (
                                            <span
                                                key={globalThis?.crypto.randomUUID()}
                                                className="mr-[10px]"
                                            >
                                                {marketCapShareItem.name}&nbsp;
                                                {marketCapShareItem.value}
                                            </span>
                                        );
                                    })}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default GlobalMarketStats;
