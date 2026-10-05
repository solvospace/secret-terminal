"use client";

import { useState, useEffect } from "react";
import { retrieveTrendingCoinsCategoriesAndNfts } from "@/services/coin.service";
import {
    TrendingCoinsCategoriesAndNftsServerResponse,
    TrendingCoinsCategoriesAndNftsClient,
    CoinCategoryOrNft,
} from "@/interfaces/trending.interface";

function useTrendingCoinsCategoriesAndNfts() {
    const [fetchingTrendingCoinsCategoriesAndNfts, setFetchingTrendingCoinsCategoriesAndNfts] = useState(true);
    const [trendingCoinsCategoriesAndNfts, setTrendingCoinsCategoriesAndNfts] = useState<
        TrendingCoinsCategoriesAndNftsClient[]
    >([]);

    useEffect(() => {
        fetchTrendingCoinsCategoriesAndNfts();
    }, []);

    async function fetchTrendingCoinsCategoriesAndNfts() {
        try {
            const response = await retrieveTrendingCoinsCategoriesAndNfts();
            createTopFiveTrendingCoinCategoryAndNftList(response);
        } catch (error) {
        } finally {
            setFetchingTrendingCoinsCategoriesAndNfts(false);
        }
    }

    function createTopFiveTrendingCoinCategoryAndNftList(serverResponse: TrendingCoinsCategoriesAndNftsServerResponse) {
        const trendingPageCards: TrendingCoinsCategoriesAndNftsClient[] = [
            {
                id: globalThis.crypto.randomUUID(),
                header: "Coins",
                type: "coins",
                list: serverResponse.coins.slice(0, 5).map((coin) => {
                    return {
                        id: coin.item.id,
                        symbol: coin.item.symbol,
                        name: coin.item.id,
                        image: coin.item.large,
                        price: coin.item.data.price,
                        priceChangePercentIn24hr: coin.item.data.price_change_percentage_24h.usd,
                    };
                }),
            },
            {
                id: globalThis.crypto.randomUUID(),
                header: `NFT's`,
                type: "nfts",
                list: serverResponse.nfts.slice(0, 5).map((nft) => {
                    return {
                        id: nft.id,
                        name: nft.name,
                        image: nft.thumb,
                        price: nft.data.floor_price,
                        priceChangePercentIn24hr: Number(nft.data.floor_price_in_usd_24h_percentage_change),
                    };
                }),
            },
            {
                id: globalThis.crypto.randomUUID(),
                header: "Categories",
                type: "categories",
                list: serverResponse.categories.slice(0, 5).map((category) => {
                    return {
                        id: String(category.id),
                        name: category.name,
                        marketCap: category.data.market_cap,
                        marketCapChangePercentIn24hr: Number(category.data.market_cap_change_percentage_24h.usd),
                        topThreeCoinImages: category.top_3_coins_images,
                    };
                }),
            },
        ];

        setTrendingCoinsCategoriesAndNfts(trendingPageCards);
    }

    return { fetchingTrendingCoinsCategoriesAndNfts, trendingCoinsCategoriesAndNfts };
}

export default useTrendingCoinsCategoriesAndNfts;
