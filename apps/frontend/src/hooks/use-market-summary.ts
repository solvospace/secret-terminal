"use client";

import { useEffect, useState, useRef } from "react";
import { retrieveTrendingCoins, retrieveAllCoins, retrieveCoinList } from "@/services/coin.service";
import { CryptoCurrency, TrendingCoin, MarketSummaryRefMap } from "@/interfaces/coin.interface";
import { roundOffNumber } from "@secret-terminal/services/utils.service";
import { StCoin } from "@secret-terminal/types/coin-list.types";
import type { MarketSummaryItem } from "@/interfaces/market-summary.interface";

const roundToDecimalPlaces = 5;

function useMarketSummary() {
    let marketSummaryRef = useRef<MarketSummaryRefMap>({
        gainers: [],
        losers: [],
        volumes: [],
        trendingCoins: [],
    }).current;
    const numberOfItemsRef = useRef<number>(15).current;
    const [marketSummary, setMarketSummary] = useState<MarketSummaryItem[]>([]);
    const [fetchingMarketSummary, setFetchingMarketSummary] = useState<boolean>(true);

    useEffect(() => {
        fetchAllCoinsAndTrendingCoins();
    }, []);

    async function fetchAllCoinsAndTrendingCoins() {
        try {
            const locationResponse = await fetch("https://ipapi.co/json");
            const locationData = await locationResponse.json();
            const countryCode = locationData.country_code;

            const promises = getPromisesByCountryCode(countryCode);
            const responses = await Promise.all(promises);

            if (!responses || responses.length === 0) return;

            if (responses[0].length > 0) {
                createTrendingCoinList(responses[0]);

                if (countryCode === "US") {
                    setMarketSummary([{ id: "trending", title: "Trending", coins: marketSummaryRef.trendingCoins }]);
                    return;
                }
            }

            if (responses[1].length > 0) {
                createGainerLoserAndVolumeList(responses[1]);
                fetchNameAndImageOfCryptoCurrencies();
            }

            createMarketSummary();
        } catch (error) {
        } finally {
            setFetchingMarketSummary(false);
        }
    }

    function getPromisesByCountryCode(countryCode: string) {
        switch (countryCode) {
            case "US":
                return [retrieveTrendingCoins()];
            default:
                return [retrieveTrendingCoins(), retrieveAllCoins()];
        }
    }

    function createTrendingCoinList(serverTrendingCoinsData: TrendingCoin[]) {
        marketSummaryRef.trendingCoins = [];
        const localTrendingCoins = serverTrendingCoinsData.map((coinData: TrendingCoin) => coinData.item);

        for (const coin of localTrendingCoins) {
            marketSummaryRef.trendingCoins.push({
                id: coin.id,
                name: coin.name,
                imageUrl: coin.large,
                symbol: coin.symbol,
                lastPrice: roundOffNumber(coin.data?.price, roundToDecimalPlaces),
                priceChangePercent: roundOffNumber(coin.data?.price_change_percentage_24h?.usd, 2),
            });
        }
    }

    function createGainerLoserAndVolumeList(cryptoCurrencyList: CryptoCurrency[]) {
        marketSummaryRef.gainers = cryptoCurrencyList
            .sort((a: CryptoCurrency, b: CryptoCurrency) => {
                return Number(b.priceChangePercent) - Number(a.priceChangePercent);
            })
            .slice(0, numberOfItemsRef);

        marketSummaryRef.losers = cryptoCurrencyList
            .sort((a: CryptoCurrency, b: CryptoCurrency) => {
                return Number(a.priceChangePercent) - Number(b.priceChangePercent);
            })
            .slice(0, numberOfItemsRef);

        marketSummaryRef.volumes = cryptoCurrencyList
            .sort((a: CryptoCurrency, b: CryptoCurrency) => {
                return Number(b.quoteVolume) - Number(a.quoteVolume);
            })
            .slice(0, numberOfItemsRef);
    }

    async function fetchNameAndImageOfCryptoCurrencies() {
        const coins = [...marketSummaryRef.gainers, ...marketSummaryRef.losers, ...marketSummaryRef.volumes];

        const symbolsInLowerCase = [...new Set(coins)].map((item: CryptoCurrency) => {
            return item.symbol.toLowerCase();
        });

        try {
            const serverCoinList = await retrieveCoinList({ symbols: symbolsInLowerCase.join(",") });

            if (serverCoinList) {
                for (const crypto of coins) {
                    crypto.lastPrice = roundOffNumber(Number(crypto.lastPrice), roundToDecimalPlaces);

                    const matchedCrypto = serverCoinList.find(
                        (item: StCoin) => crypto.symbol.toLowerCase() === item.symbol,
                    );

                    if (matchedCrypto) {
                        const priceChangePercentRoundOffValue = roundOffNumber(
                            matchedCrypto.priceChangePercent["24hr"],
                            getDecimalPlaces(matchedCrypto.priceChangePercent["24hr"]),
                        );

                        const info = {
                            id: matchedCrypto.id,
                            name: matchedCrypto.name,
                            imageUrl: matchedCrypto.imageUrl ? matchedCrypto.imageUrl : "",
                            // priceChangePercent: priceChangePercentRoundOffValue
                        };

                        Object.assign(crypto, info);
                    }
                }
            }

            createMarketSummary();
        } catch (error) {
        } finally {
        }
    }

    function getDecimalPlaces(percent: number) {
        const percentPositiveValue = Math.abs(percent);
        const decimalPlaces = -Math.floor(Math.log(percentPositiveValue) / Math.log(10) + 1);
        return decimalPlaces > 0 ? decimalPlaces : 2;
    }

    function createMarketSummary() {
        const localMarketSummary = [
            { id: "topGainer", title: "Top Gainers", coins: marketSummaryRef.gainers, show: true },
            { id: "topLoser", title: "Top Losers", coins: marketSummaryRef.losers, show: true },
            { id: "trending", title: "Trending", coins: marketSummaryRef.trendingCoins },
            { id: "topVolume", title: "Top Volume", coins: marketSummaryRef.volumes, show: true },
        ];

        setMarketSummary(localMarketSummary);
    }

    return { marketSummary, fetchingMarketSummary };
}

export default useMarketSummary;
