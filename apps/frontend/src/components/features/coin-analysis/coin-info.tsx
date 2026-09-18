"use client";

import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { formatValueIntoCommaSeparated, formatValueInUsdCompact } from "@secret-terminal/services/utils.service";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { Info } from "lucide-react";
import { coinKeyList, coinSymbolImageSize } from "@/constants/app.constants";
import type { CoinAnalysis } from "@/interfaces/coin-analysis.interface";
import useCoinInfo from "@/hooks/use-coin-info";
import CoinDetailsDialog from "@/components/features/coin-details/coin-details-dialog";
import {
    InteractiveTooltip,
    InteractiveTooltipTrigger,
    InteractiveTooltipContent,
} from "@/components/ui/interactive-tooltip";

type Bindings = CoinAnalysis;

function CoinInfo({ coinProperties }: Bindings) {
    const {
        coinInfo,
        fetchingCoinInfo,
        onCoinInfoNameAndImgClick,
        priceChangePercentage,
        showCoinDetailsDialog,
        coinInfoRef,
        setShowCoinDetailsDialog,
    } = useCoinInfo({ coinProperties });

    return fetchingCoinInfo ? (
        <Skeleton className="w-full min-h-[308px]" />
    ) : (
        <div className="coin-info-container">
            {coinInfo && (
                <>
                    <div className="header">
                        <div className="rank">#{coinInfo.marketCapRank}</div>

                        <div
                            className="flex items-center cursor-pointer"
                            onClick={() => {
                                onCoinInfoNameAndImgClick();
                            }}
                        >
                            <div className="coin-image-wrapper">
                                <Image
                                    className="coin-symbol-image"
                                    width={coinSymbolImageSize.width}
                                    height={coinSymbolImageSize.height}
                                    alt={`Image of ${coinInfo.name}`}
                                    src={coinInfo.imageUrl}
                                />
                            </div>

                            <div className="name">{coinInfo.name}</div>
                        </div>
                    </div>

                    <div className={`coin-price`}>
                        <div className="current-price">{coinInfo.currentPriceWithCurrencySymbol}</div>

                        {priceChangePercentage && priceChangePercentage !== 0 && (
                            <div
                                className={`price-change-percent ${priceChangePercentage > 0 ? "success-text" : "danger-text"}`}
                            >
                                {priceChangePercentage > 0 ? <FaCaretUp /> : <FaCaretDown />}
                                {formatValueInUsdCompact(Math.abs(priceChangePercentage), 2, false)}%
                            </div>
                        )}
                    </div>

                    <div className="other-info-wrapper">
                        {coinKeyList.map((coinKeyItem, index) => {
                            return (
                                <div
                                    key={`${index}-${coinKeyItem.key}`}
                                    className="pair"
                                >
                                    <div className="key flex items-center">
                                        <div className="mr-[4px]">{coinKeyItem.name}</div>

                                        {coinKeyItem.toolTipValue ? (
                                            <InteractiveTooltip>
                                                <InteractiveTooltipTrigger
                                                    render={<Info size={"15"} />}
                                                ></InteractiveTooltipTrigger>

                                                <InteractiveTooltipContent
                                                    side="bottom"
                                                    className="max-w-[260px]"
                                                >
                                                    {coinKeyItem.toolTipValue}
                                                </InteractiveTooltipContent>
                                            </InteractiveTooltip>
                                        ) : undefined}
                                    </div>

                                    <div className="font-medium">
                                        {coinInfo[coinKeyItem.key as keyof typeof coinInfo] ? (
                                            formatValueIntoCommaSeparated(
                                                Number(coinInfo[coinKeyItem.key as keyof typeof coinInfo]),
                                                0,
                                                true,
                                            )
                                        ) : (
                                            <div className="no-value-text">No data</div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </>
            )}

            {showCoinDetailsDialog === true && (
                <CoinDetailsDialog
                    key={crypto.randomUUID()}
                    coin={coinInfoRef.current}
                    showDialog={showCoinDetailsDialog}
                    setShowDialog={setShowCoinDetailsDialog}
                />
            )}
        </div>
    );
}

export default CoinInfo;
