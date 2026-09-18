"use client";

import Image from "next/image";
import { StCoin } from "@secret-terminal/types/coin-list.types";
import { ColumnDef } from "@tanstack/react-table";
import { Info } from "lucide-react";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import {
    formatValueInUsdCompact,
    formatValueIntoCommaSeparated,
    roundOffNumber,
} from "@secret-terminal/services/utils.service";
import { ChevronsUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/menu";
import { coinSymbolImageSize } from "@/constants/app.constants";
import {
    InteractiveTooltip,
    InteractiveTooltipContent,
    InteractiveTooltipTrigger,
} from "@/components/ui/interactive-tooltip";

const decimalPlaces = 2;

export const columns: ColumnDef<StCoin>[] = [
    {
        id: "indexNumber",
        accessorKey: "",
        header: "#",
        cell: ({ row, table }) => {
            const currentPageNumber = table.options.meta?.currentPageNumber;
            const rowsPerPage = table.options.meta?.rowsPerPage ? table.options.meta?.rowsPerPage : 0;
            return row.index + 1 + (currentPageNumber === 1 ? 0 : rowsPerPage);
        },
        meta: {
            headerClassNames: "min-w-[5%] text-center",
            cellClassNames: "text-center",
        },
    },
    {
        id: "coinDetails",
        accessorKey: "",
        header: ({ table }) => {
            const sortByFn = table.options.meta?.sortBy ? table.options.meta?.sortBy : Function();
            const currentSortingValue = table.options.meta?.currentSortingValue
                ? table.options.meta?.currentSortingValue
                : null;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                className="sorting-btn"
                                disabled={table.options.meta?.fetchingList}
                            >
                                Coin
                                {currentSortingValue === "id_asc" ? (
                                    <ArrowUp />
                                ) : currentSortingValue === "id_desc" ? (
                                    <ArrowDown />
                                ) : (
                                    <ChevronsUpDown />
                                )}
                            </Button>
                        }
                    ></DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onSelect={() => {
                                sortByFn("id_asc");
                            }}
                        >
                            Asc
                            <ArrowUp />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => {
                                sortByFn("id_desc");
                            }}
                        >
                            Desc
                            <ArrowDown />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            disabled={!currentSortingValue?.startsWith("id_")}
                            onSelect={() => {
                                sortByFn(null);
                            }}
                        >
                            Reset
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        cell: ({ row }) => {
            const imageUrl: string = row.original["imageUrl"];
            const name: string = row.original["name"];
            const symbol: string = row.original["symbol"];

            return (
                <div className="min-w-[120px] flex items-center px-3">
                    <div className="coin-image-wrapper">
                        {imageUrl ? (
                            <Image
                                className="coin-symbol-image"
                                width={coinSymbolImageSize.width}
                                height={coinSymbolImageSize.height}
                                alt={`Image of ${name}`}
                                src={imageUrl}
                            />
                        ) : (
                            <div className="coin-letter-mark">{symbol[0].toUpperCase()}</div>
                        )}
                    </div>

                    <div className="text-left font-semibold mr-[6px] flex items-center gap-1">
                        <div>{name}</div>

                        <div className="text-[12px] font-normal text-gray-500">{symbol.toUpperCase()}</div>
                    </div>
                </div>
            );
        },
        meta: {
            headerClassNames: "w-[25%] text-left sticky",
            cellClassNames: "text-center sticky",
        },
    },
    {
        accessorKey: "currentPrice",
        header: ({}) => "Current Price",
        cell: ({ row }) => {
            const currentPrice: number = row.getValue("currentPrice");
            return currentPrice && formatValueIntoCommaSeparated(currentPrice, 5, true);
        },
        meta: {
            headerClassNames: "text-right",
            cellClassNames: "text-right",
        },
    },
    {
        id: "priceChangePercentIn1hr",
        accessorFn: (row) => row.priceChangePercent?.["1hr"] ?? "",
        header: ({}) => "1h",
        cell: ({ row }) => {
            const priceChangeIn1hInPercent: number = row.original.priceChangePercent["1hr"];

            return priceChangeIn1hInPercent && priceChangeIn1hInPercent !== 0 ? (
                <div
                    className={`flex items-center justify-end ${priceChangeIn1hInPercent > 0 ? "success-text" : "danger-text"}`}
                >
                    <span className="relative bottom-[1px]">
                        {priceChangeIn1hInPercent > 0 ? <FaCaretUp /> : <FaCaretDown />}
                    </span>
                    {roundOffNumber(priceChangeIn1hInPercent, decimalPlaces).toFixed(decimalPlaces) + "%"}
                </div>
            ) : (
                <div className="no-value-text">No data</div>
            );
        },
        meta: {
            headerClassNames: "text-right",
            cellClassNames: "text-right",
        },
    },
    {
        id: "priceChangePercentIn24hr",
        accessorFn: (row) => row.priceChangePercent?.["24hr"] ?? "",
        header: ({}) => "24h",
        cell: ({ row }) => {
            const priceChangeIn24hInPercent: number = row.original.priceChangePercent["24hr"];

            return priceChangeIn24hInPercent && priceChangeIn24hInPercent !== 0 ? (
                <div
                    className={`flex items-center justify-end ${priceChangeIn24hInPercent > 0 ? "success-text" : "danger-text"}`}
                >
                    <span className="relative bottom-[1px]">
                        {priceChangeIn24hInPercent > 0 ? <FaCaretUp /> : <FaCaretDown />}
                    </span>
                    {roundOffNumber(priceChangeIn24hInPercent, decimalPlaces).toFixed(decimalPlaces) + "%"}
                </div>
            ) : (
                <div className="no-value-text">No data</div>
            );
        },
        meta: {
            headerClassNames: "text-right",
            cellClassNames: "text-right",
        },
    },
    {
        id: "priceChangePercentIn7d",
        accessorFn: (row) => row.priceChangePercent?.["7d"] ?? "",
        header: ({}) => "7d",
        cell: ({ row }) => {
            const priceChangeIn7DaysInPercent: number = row.original.priceChangePercent["7d"];

            return priceChangeIn7DaysInPercent && priceChangeIn7DaysInPercent !== 0 ? (
                <div
                    className={`flex items-center justify-end ${priceChangeIn7DaysInPercent > 0 ? "success-text" : "danger-text"}`}
                >
                    <span className="relative bottom-[1px]">
                        {priceChangeIn7DaysInPercent > 0 ? <FaCaretUp /> : <FaCaretDown />}
                    </span>

                    {roundOffNumber(priceChangeIn7DaysInPercent, decimalPlaces).toFixed(decimalPlaces) + "%"}
                </div>
            ) : (
                <div className="no-value-text">No data</div>
            );
        },
        meta: {
            headerClassNames: "text-right",
            cellClassNames: "text-right",
        },
    },
    {
        accessorKey: "totalVolume",
        header: ({ table }) => {
            const sortByFn = table.options.meta?.sortBy ? table.options.meta?.sortBy : Function();
            const currentSortingValue = table.options.meta?.currentSortingValue
                ? table.options.meta?.currentSortingValue
                : null;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                className="sorting-btn"
                                disabled={table.options.meta?.fetchingList}
                            >
                                Volume
                                {currentSortingValue === "volume_asc" ? (
                                    <ArrowUp />
                                ) : currentSortingValue === "volume_desc" ? (
                                    <ArrowDown />
                                ) : (
                                    <ChevronsUpDown />
                                )}
                            </Button>
                        }
                    ></DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onSelect={() => {
                                sortByFn("volume_asc");
                            }}
                        >
                            Asc
                            <ArrowUp />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => {
                                sortByFn("volume_desc");
                            }}
                        >
                            Desc
                            <ArrowDown />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            disabled={!currentSortingValue?.startsWith("volume_")}
                            onSelect={() => {
                                sortByFn(null);
                            }}
                        >
                            Reset
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        cell: ({ row }) => {
            const totalVolume: number = row.getValue("totalVolume");
            return (
                <div className="px-3">
                    {totalVolume && (
                        <>
                            <div>{formatValueInUsdCompact(totalVolume, 2)}</div>

                            {/* <div className="text-[grey] text-[12px]">
                                {formatValueIntoCommaSeparated(totalVolume, decimalPlaces, true)}
                            </div> */}
                        </>
                    )}
                </div>
            );
        },
        meta: {
            headerClassNames: "text-right",
            cellClassNames: "text-right",
        },
    },
    {
        accessorKey: "marketCapital",
        header: ({ table }) => {
            const sortByFn = table.options.meta?.sortBy ? table.options.meta?.sortBy : Function();
            const currentSortingValue = table.options.meta?.currentSortingValue
                ? table.options.meta?.currentSortingValue
                : null;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <Button
                                variant="ghost"
                                className="sorting-btn"
                                disabled={table.options.meta?.fetchingList}
                            >
                                Market Cap.
                                {currentSortingValue === "market_cap_asc" ? (
                                    <ArrowUp />
                                ) : currentSortingValue === "market_cap_desc" ? (
                                    <ArrowDown />
                                ) : (
                                    <ChevronsUpDown />
                                )}
                            </Button>
                        }
                    ></DropdownMenuTrigger>

                    <DropdownMenuContent>
                        <DropdownMenuItem
                            onSelect={() => {
                                sortByFn("market_cap_asc");
                            }}
                        >
                            Asc
                            <ArrowUp />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onSelect={() => {
                                sortByFn("market_cap_desc");
                            }}
                        >
                            Desc
                            <ArrowDown />
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            disabled={!currentSortingValue?.startsWith("market_cap")}
                            onSelect={() => {
                                sortByFn(null);
                            }}
                        >
                            Reset
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
        cell: ({ row }) => {
            const marketCapital: number = row.getValue("marketCapital");
            return (
                <div className="px-3">
                    {marketCapital && (
                        <>
                            <div>{formatValueInUsdCompact(marketCapital, 2)}</div>

                            {/* <div className="text-[grey] text-[12px]">
                                {formatValueIntoCommaSeparated(marketCapital, 5, true)}
                            </div> */}
                        </>
                    )}
                </div>
            );
        },
        meta: {
            headerClassNames: "text-right",
            cellClassNames: "text-right",
        },
    },
    {
        accessorKey: "circulatingSupply",
        header: ({ header }) => {
            return (
                <div className="flex justify-end">
                    <div className="mr-[4px]">Circulating Supply</div>

                    <InteractiveTooltip>
                        <InteractiveTooltipTrigger aria-label="info">
                            <Info size={15} />
                        </InteractiveTooltipTrigger>

                        <InteractiveTooltipContent
                            data-side={"top"}
                            side={"top"}
                            className="w-[300px]"
                        >
                            The amount of coins that are circulating in the market and are in public hands. It is
                            analogous to the flowing shares in the stock market.
                        </InteractiveTooltipContent>
                    </InteractiveTooltip>
                </div>
            );
        },
        cell: ({ row }) => {
            const circulatingSupply: number = row.getValue("circulatingSupply");
            return (
                <div className="pl-3">
                    {circulatingSupply && (
                        <>
                            <div>{formatValueInUsdCompact(circulatingSupply, 2)}</div>

                            {/* <div className="text-[grey] text-[12px]">
                                {formatValueIntoCommaSeparated(circulatingSupply, decimalPlaces, true)}
                            </div> */}
                        </>
                    )}
                </div>
            );
        },
        meta: {
            headerClassNames: "text-right !pr-[12px]",
            cellClassNames: "text-right !pr-[12px]",
        },
    },
];
