import Image from "next/image";
import { formatValueIntoCommaSeparated, formatValueInUsdCompact } from "@secret-terminal/services/utils.service";
import { coinSymbolImageSize } from "@/constants/app.constants";
import CoinDetailsDialog from "@/components/features/coin-details/coin-details-dialog";
import type { MarketSummaryItem } from "@/interfaces/market-summary.interface";
import type { CoinDetailsDialogCoin } from "@/interfaces/coin.interface";
import { useRef, useState } from "react";

interface Bindings {
    inDialog: boolean;
    noOfCoins: number;
    marketSummaryItem: MarketSummaryItem;
}

export default function MarketSummaryCoins(bindings: Bindings) {
    const { inDialog, noOfCoins, marketSummaryItem } = bindings;
    const [showCoinDetailsDialog, setShowCoinDetailsDialog] = useState<boolean>(false);
    const clickedCoinRef = useRef<CoinDetailsDialogCoin>(null);

    return (
        <>
            <table className={`cnv-borderless-table`}>
                {inDialog && (
                    <thead>
                        <tr>
                            <th className="w-[35px]">#</th>
                            <th className="text-left w-[40%]">Coin</th>
                            <th className="text-left">Price</th>
                            <th className="text-right">24hr Change</th>
                        </tr>
                    </thead>
                )}

                <tbody>
                    {marketSummaryItem.coins.length > 0 &&
                        marketSummaryItem.coins.slice(0, noOfCoins).map((coin, index) => {
                            return (
                                <tr key={coin.id}>
                                    {inDialog && <td className="text-center">{index + 1}</td>}

                                    <td className={`${!inDialog && "w-[40%]"}`}>
                                        <div
                                            className={`flex items-center ${inDialog ? "max-w-[inherit]" : "max-w-[150px] md:max-w-[130px]"}`}
                                        >
                                            <div className="coin-image-wrapper">
                                                {coin.imageUrl ? (
                                                    <Image
                                                        className="coin-symbol-image"
                                                        width={coinSymbolImageSize.width}
                                                        height={coinSymbolImageSize.height}
                                                        alt={`Image of ${coin.name}`}
                                                        src={coin.imageUrl}
                                                    />
                                                ) : (
                                                    <div className="coin-letter-mark">{coin.symbol[0]}</div>
                                                )}
                                            </div>

                                            <div
                                                className="coin-name cursor-pointer"
                                                onClick={() => {
                                                    clickedCoinRef.current = {
                                                        id: coin.id,
                                                        name: coin.name,
                                                        imageUrl: coin.imageUrl,
                                                        symbol: coin.symbol,
                                                    };
                                                    setShowCoinDetailsDialog(true);
                                                }}
                                            >
                                                {coin.symbol}
                                            </div>
                                        </div>
                                    </td>

                                    <td className={`text-left`}>
                                        {coin.lastPrice && (
                                            <span className="break-all">
                                                {inDialog
                                                    ? formatValueIntoCommaSeparated(coin.lastPrice, 5, true)
                                                    : coin.lastPrice > 999
                                                      ? formatValueInUsdCompact(coin.lastPrice, 2)
                                                      : `$${coin.lastPrice}`}
                                            </span>
                                        )}
                                    </td>

                                    <td className="text-right">
                                        {coin.priceChangePercent && (
                                            <>
                                                {(marketSummaryItem.id === "topGainer" ||
                                                    marketSummaryItem.id === "topVolume" ||
                                                    marketSummaryItem.id === "trending") && (
                                                    <span
                                                        className={`${coin.priceChangePercent > 0 ? "success-text" : "danger-text"}`}
                                                    >
                                                        {formatValueInUsdCompact(coin.priceChangePercent, 2, false)}%
                                                    </span>
                                                )}

                                                {marketSummaryItem.id === "topLoser" && (
                                                    <span className="danger-text">
                                                        {formatValueInUsdCompact(coin.priceChangePercent, 2, false)}%
                                                    </span>
                                                )}
                                            </>
                                        )}
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>

            <CoinDetailsDialog
                coin={clickedCoinRef.current}
                showDialog={showCoinDetailsDialog}
                setShowDialog={setShowCoinDetailsDialog}
                dialogLevel={noOfCoins > 3 ? 2 : 1}
            />
        </>
    );
}
