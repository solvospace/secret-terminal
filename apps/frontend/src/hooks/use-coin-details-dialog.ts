"use client";

import { useEffect, useState } from "react";
import { ClientCoinProperties } from "@secret-terminal/types/coin-details.types";
import { retrieveCoinDetailsByCoinId } from "@/services/coin.service";
import { CoinDetailsDialogCoin } from "../interfaces/coin.interface";
import { createText } from "@/services/ai.service";

type Bindings = {
    showDialog: boolean;
    coin: CoinDetailsDialogCoin | null;
};

export default function useCoinDetailsDialog(bindings: Bindings) {
    const { showDialog, coin } = bindings;
    const coinId = coin?.id;
    const coinSymbol = coin?.symbol;
    const [coinDetails, setCoinDetails] = useState<ClientCoinProperties | null>(null);
    const [fetchingCoinDetails, setFetchingCoinDetails] = useState<boolean>(false);

    useEffect(() => {
        if (!showDialog) return;
        if (!coin) return;

        if (coinId && !isUUID(coinId)) {
            fetchCoinDetailsByCoinId(coinId);
        } else {
            if (coinSymbol) fetchCoinDetailsByName(coinSymbol);
        }
    }, [coinId, coinSymbol, showDialog]);

    async function fetchCoinDetailsByCoinId(coinId: string) {
        if (!coinId) return;
        setCoinDetails(null);
        setFetchingCoinDetails(true);

        try {
            const response = await retrieveCoinDetailsByCoinId(coinId);
            const coinProperties = response.data.data;
            coinProperties.description = await getCoinDescription(coinProperties.name);
            if (coinProperties) setCoinDetails(coinProperties);
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingCoinDetails(false);
        }
    }

    async function fetchCoinDetailsByName(nameOrSymbol: string) {
        if (!coin) return;

        setCoinDetails(null);
        setFetchingCoinDetails(true);

        try {
            const description = await getCoinDescription(nameOrSymbol);

            if (!description) return;

            setCoinDetails({
                id: coin.id,
                symbol: coin.symbol,
                description: description,
            });
        } catch (error) {
            console.error(error);
        } finally {
            setFetchingCoinDetails(false);
        }
    }

    async function getCoinDescription(symbol: string) {
        const prompt = `Explain ${symbol} in 50 to 100 words. Briefly cover what it is,
                    its main purpose, how it works, its key features, and what makes it different from other cryptocurrencies.
                    Use simple, clear language suitable for someone who understands basic cryptocurrency concepts.
                    Avoid unnecessary technical details, speculation, and overly promotional language.`;

        try {
            const response = await createText({ prompt });
            return response.data.data;
        } finally {
        }
    }

    function isUUID(value: string) {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(value);
    }

    return { fetchingCoinDetails, coinDetails };
}
