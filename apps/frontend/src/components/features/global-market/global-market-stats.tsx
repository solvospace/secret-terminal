"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import useGlobalMarketStats from "@/hooks/use-global-market-stats";
import { formatValueInUsdCompact, roundOffNumber } from "@secret-terminal/services/utils.service";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";

function GlobalMarketStats() {
    const { globalMarketStats, fetchingGlobalMarketStats, scrollReachedBottom } = useGlobalMarketStats();

    return (
        <section className="global-market-stats-container">
            <h2 className="gm-heading">Global Market</h2>

            {fetchingGlobalMarketStats ? (
                <Skeleton className="w-full h-[73px]" />
            ) : (
                <div className="gm-body">
                    {globalMarketStats.totalCoins && (
                        <div className="group">
                            <div className="label">Total Coins</div>
                            <div className="value">{globalMarketStats.totalCoins}</div>
                        </div>
                    )}

                    {globalMarketStats.exchanges && (
                        <div className="group">
                            <div className="label">Exchanges</div>
                            <div className="value">{globalMarketStats.exchanges}</div>
                        </div>
                    )}

                    {globalMarketStats.totalMarketCapital && (
                        <div className="group">
                            <div className="label">Market Capital</div>

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
                        <div className="group">
                            <div className="label">24h Volume</div>

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
                        <div className="group">
                            <div className="label">Dominance</div>

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
        </section>
    );
}

export default GlobalMarketStats;
