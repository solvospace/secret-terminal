"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { getRowsPerPageDefaultValue } from "@secret-terminal/services/utils.service";
import { getUiRoute } from "@/services/utils.service";
import { CoinListApiParams } from "@secret-terminal/types/coin-list.types";
import { Row } from "@tanstack/react-table";
import { search, retrieveCoinList } from "@/services/coin.service";
import { Route } from "next";
import { StCoin } from "@secret-terminal/types/coin-list.types";

function useCoinList() {
    const router = useRouter();
    const [coinList, setCoinList] = useState<StCoin[]>([]);
    const [fetchingCoinList, setFetchingCoinList] = useState<boolean>(true);
    const [rowsPerPage, setRowsPerPage] = useState<number>(getRowsPerPageDefaultValue());
    const [sortingValue, setSortingValue] = useState<string | null>("market_cap_desc");
    const [currentPageNumber, setCurrentPageNumber] = useState(1);
    const [searchValue, setSearchValue] = useState<string>("");
    const [showCoinDetailsDialog, setShowCoinDetailsDialog] = useState<boolean>(false);

    const clickedCoinRef = useRef<StCoin>(null);
    const rowsPerPageListRef = useRef([10, 25, 50, 100, 150, 200, 250]);
    const abortControllerRef = useRef<AbortController | null>(null);
    const previousSearchValueRef = useRef<string | null>(null);
    const searchedCoinsSymbolsRef = useRef<string | null>(null);
    const requestIdRef = useRef<number>(0);

    useEffect(() => {
        let debounceHandler: ReturnType<typeof setTimeout>;

        if (searchValue.length > 0 && searchValue !== previousSearchValueRef.current) {
            debounceHandler = setTimeout(() => {
                fetchCoins();
            }, 500);
        } else {
            fetchCoins();
            previousSearchValueRef.current = null;
            searchedCoinsSymbolsRef.current = null;
        }

        return () => {
            clearTimeout(debounceHandler);
        };
    }, [searchValue, currentPageNumber, rowsPerPage, sortingValue]);

    async function fetchCoins() {
        setFetchingCoinList(true);
        if (coinList.length !== 0) setCoinList([]);
        const requestId = ++requestIdRef.current;

        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        const { signal } = abortControllerRef.current;

        let params: CoinListApiParams = {
            page: currentPageNumber,
            per_page: rowsPerPage,
            order: sortingValue,
        };

        try {
            if (searchValue.length > 0) {
                if (searchValue !== previousSearchValueRef.current) {
                    previousSearchValueRef.current = searchValue;
                    const response = await search({ query: searchValue }, signal);
                    searchedCoinsSymbolsRef.current = createSymbolsFromSearchedCoins(response.data.data.coins);
                }

                if (searchedCoinsSymbolsRef.current?.length === 0) {
                    setCoinList([]);
                    return;
                }

                params.symbols = searchedCoinsSymbolsRef.current;
            }

            const coinMarketDataList = await retrieveCoinList(params, signal);

            if (requestId !== requestIdRef.current) return;

            prefetchCoinDetailsPageRoutes(coinMarketDataList);
            setCoinList(coinMarketDataList ? coinMarketDataList : []);
        } catch (error) {
            if (error instanceof DOMException && error.name === "AbortError") return;
            if (requestId !== requestIdRef.current) return;
        } finally {
            if (requestId === requestIdRef.current) {
                setFetchingCoinList(false);
            }
        }
    }

    function prefetchCoinDetailsPageRoutes(coins: StCoin[]) {
        for (const coin of coins) {
            const path = getUiRoute("coinAnalysis", coin);
            if (path) router.prefetch(path as Route);
        }
    }

    function createSymbolsFromSearchedCoins(coins: Record<string, string>[]) {
        const symbols = [];
        for (const coin of coins) {
            symbols.push(coin.symbol.toLowerCase());
        }

        return symbols.join();
    }

    function onRowsPerPageChange(value: string) {
        setRowsPerPage(Number(value));
    }

    function setSortingValueFromDt(key: string) {
        setSortingValue(key ? key : null);
    }

    function onSearchInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        setCurrentPageNumber(1);
        setSearchValue(event.target.value);
    }

    function onRowClicked(row: Row<StCoin>) {
        const route = getUiRoute("coinAnalysis", row.original);

        if (route) {
            router.push(route as Route);
        }
    }

    function onContextMenuItemClicked(
        row: Row<StCoin>,
        contextMenu: Record<string, string>,
        event: React.MouseEvent<HTMLDivElement>,
    ) {
        if (contextMenu.name === "Analyze Coin") {
            const route = getUiRoute("coinAnalysis", row.original);

            if (route) {
                Object.assign(document.createElement("a"), {
                    href: route,
                    target: "_blank",
                    rel: "noopener noreferrer",
                }).click();
            }
        } else if (contextMenu.name === "View Details") {
            clickedCoinRef.current = row.original;
            setShowCoinDetailsDialog(true);
        }
    }

    return {
        fetchingCoinList,
        coinList,
        rowsPerPage,
        sortingValue,
        currentPageNumber,
        searchValue,
        showCoinDetailsDialog,
        clickedCoinRef,
        rowsPerPageListRef,
        setSearchValue,
        setCurrentPageNumber,
        onRowsPerPageChange,
        setSortingValueFromDt,
        onSearchInputChange,
        onRowClicked,
        onContextMenuItemClicked,
        setShowCoinDetailsDialog,
    };
}

export default useCoinList;
