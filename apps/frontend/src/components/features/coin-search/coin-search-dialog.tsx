import Image from "next/image";
import useCoinSearchDialog from "@/hooks/use-coin-search-dialog";
import { coinSymbolImageSize } from "@/constants/app.constants";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogOverlay,
} from "@/components/ui/dialog";
import { CirclePlus, Search, X } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Dispatch, SetStateAction } from "react";
import { formatValueIntoCommaSeparated, roundOffNumber } from "@secret-terminal/services/utils.service";
import { Skeleton } from "@/components/ui/skeleton";
import { FaCaretUp, FaCaretDown } from "react-icons/fa";
import { DialogProps } from "@/interfaces/global.interface";

type Bindings = {
    context?: string;
    contextProperties?: Record<string, string>;
    onDialogClose?: () => void;
    dialogLevel?: number;
} & DialogProps;

function CoinSearchDialog(bindings: Bindings) {
    let { showDialog, setShowDialog, context, contextProperties, onDialogClose, dialogLevel } = bindings;
    const {
        searchValue,
        setSearchValue,
        onSearchValueChange,
        searchingCoins,
        coins,
        onCoinClick,
        addCoinToActiveWatchlist,
        fetchingCoinsMarketData,
    } = useCoinSearchDialog({ showDialog, setShowDialog, contextProperties, context });

    return (
        <div>
            <Dialog
                open={showDialog}
                onOpenChange={(showDialog) => {
                    setShowDialog(showDialog);
                    if (!showDialog && onDialogClose) {
                        onDialogClose();
                    }
                }}
                closeOnOutsideClick={true}
            >
                <DialogContent dialogLevel={dialogLevel}>
                    <DialogHeader
                        showCloseButton={false}
                        className="p-[12px]"
                    >
                        <DialogTitle className="font-normal">
                            <div className="flex items-center">
                                <InputGroup className="w-full h-[40px] w-[stretch]">
                                    <InputGroupInput
                                        type="text"
                                        tabIndex={0}
                                        placeholder="Search by name..."
                                        className="!text-[13px] h-[inherit]"
                                        value={searchValue}
                                        onChange={(event) => {
                                            onSearchValueChange(event);
                                        }}
                                    />

                                    <InputGroupAddon>
                                        <Search className="size-4" />
                                    </InputGroupAddon>

                                    <InputGroupAddon
                                        className={`clear-btn ${searchValue && searchValue.length > 0 ? "block" : "hidden"}`}
                                        align="inline-end"
                                        onClick={() => {
                                            setSearchValue("");
                                        }}
                                    >
                                        <X />
                                    </InputGroupAddon>
                                </InputGroup>

                                <div className={`ml-[8px] cursor-pointer text-[12px] text-[var(--grey-color-3)]`}>
                                    <a
                                        onClick={() => {
                                            if (onDialogClose) onDialogClose();
                                            setShowDialog(false);
                                        }}
                                    >
                                        Cancel
                                    </a>
                                </div>
                            </div>

                            <DialogDescription className="text-[11px] m-[4px_0px] sr-only">
                                coin search dialog
                            </DialogDescription>
                        </DialogTitle>
                    </DialogHeader>

                    <DialogBody>
                        {searchingCoins === true ? (
                            <Spinner className="size-10 mx-auto" />
                        ) : coins.length > 0 ? (
                            <>
                                <div className="text-gray-500 text-[12px] mb-[8px]">Search Results</div>

                                <table className="cnv-borderless-table coin-search-table">
                                    <tbody>
                                        {coins.map((coin, index) => {
                                            return (
                                                <tr
                                                    tabIndex={0}
                                                    key={coin.id}
                                                    onClick={(event) => {
                                                        onCoinClick(event, coin);
                                                    }}
                                                    onKeyDown={(event) => {
                                                        if (event.key === "Enter") {
                                                            onCoinClick(event, coin);
                                                        }
                                                    }}
                                                >
                                                    <td>
                                                        <div className="flex items-center">
                                                            <div className="coin-image-wrapper">
                                                                {coin.large ? (
                                                                    <Image
                                                                        className="coin-symbol-image"
                                                                        width={coinSymbolImageSize.width}
                                                                        height={coinSymbolImageSize.height}
                                                                        alt={`Image of ${coin.name}`}
                                                                        src={coin.large}
                                                                    />
                                                                ) : (
                                                                    <div className="coin-letter-mark cursor-pointer">
                                                                        {coin.symbol[0]}
                                                                    </div>
                                                                )}
                                                            </div>

                                                            <div className="coin-name">{coin.name}</div>
                                                        </div>
                                                    </td>

                                                    <td className="text-right">
                                                        {fetchingCoinsMarketData === true ? (
                                                            <Skeleton className="h-[21px] w-[60px] float-right" />
                                                        ) : (
                                                            coin.marketData && (
                                                                <div className="mr-[2px]">
                                                                    {formatValueIntoCommaSeparated(
                                                                        coin.marketData.currentPrice,
                                                                        5,
                                                                        true,
                                                                    )}
                                                                </div>
                                                            )
                                                        )}
                                                    </td>

                                                    <td className="text-right">
                                                        {fetchingCoinsMarketData === true ? (
                                                            <Skeleton className="h-[21px] w-[60px] float-right" />
                                                        ) : coin.marketData?.priceChangePercent["1hr"] ? (
                                                            <span
                                                                className={`flex items-center justify-end ${coin.marketData.priceChangePercent["1hr"] > 0 ? "success-text" : "danger-text"}`}
                                                            >
                                                                {coin.marketData.priceChangePercent["1hr"] > 0 ? (
                                                                    <FaCaretUp />
                                                                ) : (
                                                                    <FaCaretDown />
                                                                )}
                                                                {roundOffNumber(
                                                                    coin.marketData.priceChangePercent["1hr"],
                                                                    2,
                                                                ).toFixed(2) + "%"}
                                                            </span>
                                                        ) : (
                                                            <div className="no-value-text">No data</div>
                                                        )}
                                                    </td>

                                                    {context === "watchlist" && (
                                                        <td
                                                            className="place-items-end"
                                                            onClick={(event) => {
                                                                event?.stopPropagation();
                                                                event?.preventDefault();
                                                                addCoinToActiveWatchlist(coin);
                                                            }}
                                                        >
                                                            {coin.loading === true ? (
                                                                <Spinner className="size-5" />
                                                            ) : (
                                                                <CirclePlus className="size-5" />
                                                            )}
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </>
                        ) : (
                            <div className="no-value-text !text-center">
                                {searchValue ? `No coins found.` : "Search for a coin to get started."}
                            </div>
                        )}
                    </DialogBody>

                    <DialogFooter>
                        <div className="text-[.75em] text-[grey] text-right">
                            Click the coin to go to the analysis page.
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default CoinSearchDialog;
