import Image from "next/image";
import { CoinCategoryOrNft } from "@/interfaces/trending.interface";
import { coinSymbolImageSize } from "@/constants/app.constants";
import { formatValueInUsdCompact } from "@secret-terminal/services/utils.service";

type Bindings = {
    type: string;
    list: CoinCategoryOrNft[];
};

function TrendingCoinsCategoriesAndNftsTable(bindings: Bindings) {
    const { list, type } = bindings;

    return (
        <div className="trending-table-wrapper">
            <table className={`cnv-borderless-table table`}>
                <thead className="hidden">
                    <tr>
                        <th className="text-left w-[25%]">Name</th>

                        {type === "categories" && <th className="text-left">Top Gainers</th>}

                        <th className="text-left">
                            {type === "coins" || type === "nfts" ? "Price" : type === "categories" ? "Market Cap" : ""}
                        </th>

                        <th className="text-right">24hr Change</th>
                    </tr>
                </thead>

                <tbody>
                    {list.map((coinCategoryOrNft, index) => {
                        return (
                            <tr key={coinCategoryOrNft.id}>
                                <td>
                                    <div className="flex items-center">
                                        {["coins", "nfts"].includes(type) && (
                                            <div className="coin-image-wrapper">
                                                {coinCategoryOrNft.image ? (
                                                    <Image
                                                        className="coin-symbol-image"
                                                        width={coinSymbolImageSize.width}
                                                        height={coinSymbolImageSize.height}
                                                        alt={`Image of ${coinCategoryOrNft.name}`}
                                                        src={coinCategoryOrNft.image}
                                                    />
                                                ) : (
                                                    coinCategoryOrNft.symbol && (
                                                        <div className="coin-letter-mark cursor-pointer">
                                                            {coinCategoryOrNft.symbol[0]}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}

                                        <div className="w-[inherit] lg:w-[110px]">
                                            {["categories", "nfts"].includes(type) && (
                                                <div className="whitespace-pre overflow-hidden text-ellipsis">
                                                    {coinCategoryOrNft.name}
                                                </div>
                                            )}

                                            {type === "coins" && (
                                                <div className="coin-name cursor-pointer">{coinCategoryOrNft.symbol}</div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                {type === "categories" &&
                                    coinCategoryOrNft.topThreeCoinImages &&
                                    coinCategoryOrNft.topThreeCoinImages.length > 0 && (
                                        <td>
                                            <div className="flex flex-wrap gap-2 mr-[6px] w-max">
                                                {coinCategoryOrNft.topThreeCoinImages.map((coinImage, index) => {
                                                    return (
                                                        <div
                                                            key={`${coinCategoryOrNft.name}-${index}`}
                                                            className="coin-image-wrapper !mr-[unset]"
                                                        >
                                                            <Image
                                                                key={`topThreeCoinImage-${index}`}
                                                                className="coin-symbol-image"
                                                                width={coinSymbolImageSize.width}
                                                                height={coinSymbolImageSize.height}
                                                                alt={`Image of one of top three coin`}
                                                                src={coinImage}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    )}

                                <td className={`text-left`}>
                                    <span className="break-all">
                                        {type === "coins" && formatValueInUsdCompact(Number(coinCategoryOrNft.price), 2)}
                                        {type === "nfts" && <span>{coinCategoryOrNft.price}</span>}
                                        {type === "categories" &&
                                            formatValueInUsdCompact(Number(coinCategoryOrNft.marketCap), 2, true)}
                                    </span>
                                </td>

                                <td className="text-right">
                                    {(type === "coins" || type === "nfts") &&
                                        coinCategoryOrNft.priceChangePercentIn24hr && (
                                            <span
                                                className={`${coinCategoryOrNft.priceChangePercentIn24hr > 0 ? "success-text" : "danger-text"}`}
                                            >
                                                {formatValueInUsdCompact(
                                                    coinCategoryOrNft.priceChangePercentIn24hr,
                                                    2,
                                                    false,
                                                )}
                                                %
                                            </span>
                                        )}

                                    {type === "categories" && coinCategoryOrNft.marketCapChangePercentIn24hr && (
                                        <span
                                            className={`${coinCategoryOrNft.marketCapChangePercentIn24hr > 0 ? "success-text" : "danger-text"}`}
                                        >
                                            {formatValueInUsdCompact(
                                                coinCategoryOrNft.marketCapChangePercentIn24hr,
                                                2,
                                                false,
                                            )}
                                            %
                                        </span>
                                    )}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default TrendingCoinsCategoriesAndNftsTable;
