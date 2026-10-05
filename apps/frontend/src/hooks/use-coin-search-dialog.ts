"use client";

import { useState, useEffect, SetStateAction, Dispatch, use } from "react";
import { retrieveCoinList, search } from "@/services/coin.service";
import { getUiRoute } from "@/services/utils.service";
import { SearchApiCoin } from "@/interfaces/coin.interface";
import { StCoin } from "@secret-terminal/types/coin-list.types";
import { addWatchlistCoin } from "@/services/watchlist-coin.service";
import { Route } from "next";
import { useRouter } from "next/navigation";

type Bindings = {
    showDialog: boolean;
    setShowDialog: Dispatch<SetStateAction<boolean>>;
    context?: string;
    contextProperties?: Record<string, string>;
};

export default function useCoinSearchDialog(bindings: Bindings) {
    const { showDialog, setShowDialog, contextProperties, context } = bindings;
    const [searchValue, setSearchValue] = useState<string>("");
    const [searchingCoins, setSearchingCoins] = useState<boolean>(false);
    const [coins, setCoins] = useState<SearchApiCoin[]>([]);
    const [fetchingCoinsMarketData, setCoinsFetchingMarketData] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        if (!showDialog) return;
    }, [showDialog]);

    useEffect(() => {
        if (coins.length > 0) fetchCoinsMarketData();
    }, [coins]);

    useEffect(() => {
        let debounceHandler: ReturnType<typeof setTimeout>;

        if (searchValue.length > 0) {
            debounceHandler = setTimeout(() => {
                searchCoin();
            }, 300);
        } else {
            if (coins.length > 0) setCoins([]);
        }

        return () => {
            clearTimeout(debounceHandler);
        };
    }, [searchValue]);

    function onSearchValueChange(event: React.ChangeEvent<HTMLInputElement>) {
        setSearchValue(event.target.value);
    }

    async function searchCoin() {
        setSearchingCoins(true);

        try {
            const response = await search({ query: searchValue });
            const serverCoins = response.data.data.coins;
            for (const coin of serverCoins) {
                const route = getUiRoute("coinAnalysis", coin);
                if (route) router.prefetch(route as Route);
                if (!coin.large.startsWith("https")) coin.large = null;
            }

            setCoins(serverCoins);
        } catch (error) {
        } finally {
            setSearchingCoins(false);
        }
    }

    function onCoinClick(event: React.SyntheticEvent, coin: SearchApiCoin) {
        const route = getUiRoute("coinAnalysis", coin);

        if (context) {
            event.preventDefault();
            event.stopPropagation();

            const externalLink = document.createElement("a");
            Object.assign(externalLink, {
                href: route,
                target: "_blank",
                rel: "noopener noreferrer",
            }).click();

            externalLink.remove();
        } else {
            setShowDialog(false);
            router.push(route as Route);
        }
    }

    async function addCoinToActiveWatchlist(coin: SearchApiCoin) {
        try {
            coin.loading = true;
            updateLoadingValue(coin);

            const data = {
                watchlistId: contextProperties?.id,
                coinId: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                imageUrl: coin.large,
            };

            await addWatchlistCoin(data);
        } catch (error) {
        } finally {
            coin.loading = false;
            updateLoadingValue(coin);
        }
    }

    function updateLoadingValue(coin: SearchApiCoin) {
        setCoins((previousCoins) => {
            return previousCoins.map((previousCoin) => {
                return previousCoin.id === coin.id ? coin : previousCoin;
            });
        });
    }

    async function fetchCoinsMarketData() {
        try {
            setCoinsFetchingMarketData(true);

            const params = {
                symbols: coins
                    .map((coin) => {
                        return coin.symbol.toLowerCase();
                    })
                    .toString(),
            };

            const marketDataList = await retrieveCoinList(params);

            coins.map((coin) => {
                const foundMarketData = marketDataList.find((marketData: StCoin) => {
                    return coin.symbol.toLocaleLowerCase() === marketData.symbol;
                });

                coin.marketData = foundMarketData;
                return coin;
            });
        } catch (error) {
        } finally {
            setCoinsFetchingMarketData(false);
        }
    }

    return {
        searchValue,
        setSearchValue,
        onSearchValueChange,
        searchingCoins,
        coins,
        onCoinClick,
        addCoinToActiveWatchlist,
        fetchingCoinsMarketData,
    };
}
