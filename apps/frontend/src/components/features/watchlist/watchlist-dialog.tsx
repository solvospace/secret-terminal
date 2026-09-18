import Image from "next/image";
import useWatchlistDialog from "@/hooks/use-watchlist-dialog";
import WatchlistFormDialog from "./watchlist-form-dialog";
import CoinSearchDialog from "@/components/features/coin-search/coin-search-dialog";
import CoinDetailsDialog from "../coin-details/coin-details-dialog";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogBody,
    DialogContent,
    DialogFooter,
} from "@/components/ui/dialog";
import { DialogProps } from "@/interfaces/global.interface";
import { Button } from "@/components/ui/button";
import { CirclePlus } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuGroup,
    ContextMenuItem,
    ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { WatchlistCoin } from "@/interfaces/watchlist.interface";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { formatValueIntoCommaSeparated, roundOffNumber } from "@secret-terminal/services/utils.service";
import { coinSymbolImageSize } from "@/constants/app.constants";

type Bindings = DialogProps;

export default function WatchlistDialog(bindings: Bindings) {
    const { showDialog, setShowDialog } = bindings;
    const {
        showWatchlistFormDialog,
        setShowWatchlistFormDialog,
        fetchingWatchlists,
        watchlists,
        onWatchlistClick,
        activeWatchlist,
        fetchingWatchlistCoins,
        watchlistCoins,
        onWatchlistFormDialogClose,
        watchlistContextMenuList,
        onContextMenuItemClicked,
        showCoinSearchDialog,
        setShowCoinSearchDialog,
        onCoinSearchDialogClose,
        showDeleteDialog,
        setShowDeleteDialog,
        onDeleteBtnClicked,
        deletingItem,
        onDeleteDialogClose,
        fetchingMarketData,
        watchlistCoinContextMenuList,
        rightClickedItem,
        deleteDialogType,
        selectedWatchlist,
        showWatchlistDetailsDialog,
        setShowWatchlistDetailsDialog,
        showCoinDetailsDialog,
        setShowCoinDetailsDialog,
    } = useWatchlistDialog({ showDialog, setShowDialog });

    return (
        <>
            <Dialog
                open={showDialog}
                onOpenChange={setShowDialog}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Watchlist</DialogTitle>

                        <DialogDescription className="sr-only">watchlist dialog</DialogDescription>
                    </DialogHeader>

                    <DialogBody>
                        <Watchlists
                            fetchingWatchlists={fetchingWatchlists}
                            watchlists={watchlists}
                            onWatchlistClick={onWatchlistClick}
                            activeWatchlist={activeWatchlist}
                            watchlistContextMenuList={watchlistContextMenuList}
                            onContextMenuItemClicked={onContextMenuItemClicked}
                        />

                        <WatchlistCoinList
                            fetchingWatchlists={fetchingWatchlists}
                            watchlists={watchlists}
                            fetchingWatchlistCoins={fetchingWatchlistCoins}
                            watchlistCoins={watchlistCoins}
                            fetchingMarketData={fetchingMarketData}
                            watchlistCoinContextMenuList={watchlistCoinContextMenuList}
                            onContextMenuItemClicked={onContextMenuItemClicked}
                        />
                    </DialogBody>

                    <DialogFooter className="justify-center">
                        <Button
                            variant={"outline"}
                            onClick={() => {
                                setShowCoinSearchDialog(true);
                            }}
                            disabled={fetchingWatchlists}
                        >
                            <CirclePlus /> Add Coins
                        </Button>

                        <Button
                            variant={"outline"}
                            onClick={() => {
                                setShowWatchlistFormDialog(true);
                            }}
                            disabled={fetchingWatchlists}
                        >
                            <CirclePlus />
                            Create Watchlist
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {showWatchlistFormDialog && (
                <WatchlistFormDialog
                    dialogLevel={2}
                    showDialog={showWatchlistFormDialog}
                    setShowDialog={setShowWatchlistFormDialog}
                    onDialogClose={onWatchlistFormDialogClose}
                    watchlist={selectedWatchlist.current}
                ></WatchlistFormDialog>
            )}

            {showDeleteDialog && (
                <DeleteDialog
                    showDeleteDialog={showDeleteDialog}
                    setShowDeleteDialog={setShowDeleteDialog}
                    onDeleteBtnClicked={onDeleteBtnClicked}
                    deletingItem={deletingItem}
                    onDeleteDialogClose={onDeleteDialogClose}
                    rightClickedItem={rightClickedItem}
                    deleteDialogType={deleteDialogType}
                />
            )}

            {showWatchlistDetailsDialog && (
                <WatchlistDetailsDialog
                    showWatchlistDetailsDialog={showWatchlistDetailsDialog}
                    setShowWatchlistDetailsDialog={setShowWatchlistDetailsDialog}
                    watchlist={rightClickedItem}
                />
            )}

            {showCoinDetailsDialog && (
                <CoinDetailsDialog
                    dialogLevel={2}
                    showDialog={showCoinDetailsDialog}
                    setShowDialog={setShowCoinDetailsDialog}
                    coin={
                        rightClickedItem && {
                            id: rightClickedItem.coinId,
                            name: rightClickedItem.name,
                            symbol: rightClickedItem.symbol,
                            imageUrl: rightClickedItem.imageUrl,
                        }
                    }
                />
            )}

            {showCoinSearchDialog && activeWatchlist && (
                <CoinSearchDialog
                    dialogLevel={2}
                    showDialog={showCoinSearchDialog}
                    setShowDialog={setShowCoinSearchDialog}
                    context={"watchlist"}
                    contextProperties={activeWatchlist}
                    onDialogClose={onCoinSearchDialogClose}
                />
            )}
        </>
    );
}

function Watchlists(props: any) {
    const {
        fetchingWatchlists,
        watchlists,
        onWatchlistClick,
        activeWatchlist,
        watchlistContextMenuList,
        onContextMenuItemClicked,
    } = props;

    return fetchingWatchlists === true ? (
        <Skeleton className="h-[34px] w-full" />
    ) : watchlists && watchlists.length > 0 ? (
        <div className={`navigation-tab-bar watchlist-tab-bar`}>
            <Tabs
                defaultValue={watchlists[0].name}
                value={activeWatchlist?.name}
            >
                <TabsList>
                    {watchlists.map((watchlist: Record<string, string>) => {
                        return (
                            <ContextMenu key={watchlist.id}>
                                <ContextMenuTrigger>
                                    <TabsTrigger
                                        className="h-[25px]"
                                        value={watchlist.name}
                                        onClick={(event) => {
                                            onWatchlistClick(event, watchlist);
                                        }}
                                    >
                                        {watchlist.name}
                                    </TabsTrigger>
                                </ContextMenuTrigger>

                                <ContextMenuContent className="z-[201]">
                                    <ContextMenuGroup>
                                        {watchlistContextMenuList.map((contextMenuItem: Record<string, string>) => {
                                            return (
                                                <ContextMenuItem
                                                    variant={`${contextMenuItem.name === "Delete" ? "destructive" : "default"}`}
                                                    key={contextMenuItem.id}
                                                    onSelect={(event) =>
                                                        onContextMenuItemClicked(
                                                            watchlist,
                                                            contextMenuItem,
                                                            event,
                                                            "watchlist",
                                                        )
                                                    }
                                                    disabled={
                                                        activeWatchlist.id === watchlist.id &&
                                                        contextMenuItem.name === "Delete" &&
                                                        true
                                                    }
                                                >
                                                    {contextMenuItem.name}
                                                </ContextMenuItem>
                                            );
                                        })}
                                    </ContextMenuGroup>
                                </ContextMenuContent>
                            </ContextMenu>
                        );
                    })}
                </TabsList>
            </Tabs>
        </div>
    ) : (
        <div className="no-value-text !text-center">No watchlist found</div>
    );
}

function WatchlistCoinList(props: any) {
    const {
        fetchingWatchlists,
        watchlists,
        fetchingWatchlistCoins,
        watchlistCoins,
        showCoinSearchDialog,
        setShowCoinSearchDialog,
        activeWatchlist,
        onCoinSearchDialogClose,
        fetchingMarketData,
        watchlistCoinContextMenuList,
        onContextMenuItemClicked,
    } = props;

    return (
        watchlists.length > 0 &&
        fetchingWatchlists === false && (
            <>
                {fetchingWatchlistCoins === true ? (
                    <div className="m-auto w-max">
                        <Spinner className="size-8" />
                    </div>
                ) : (
                    <div className="watchlist-coins-container">
                        {watchlistCoins.length > 0 ? (
                            <table className="cnv-borderless-table watchlist-coins-table">
                                <thead>
                                    <tr>
                                        <th className="text-center">#</th>
                                        <th className="text-left">Coin</th>
                                        <th className="text-right">Price</th>
                                        <th className="text-right !pr-[8px]">1hr</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {watchlistCoins.map((watchlistCoin: WatchlistCoin, index: number) => {
                                        return (
                                            <ContextMenu key={watchlistCoin.id}>
                                                <ContextMenuTrigger
                                                    render={
                                                        <tr>
                                                            <td className="!w-[30px] text-center !pl-[unset]">
                                                                {index + 1}
                                                            </td>

                                                            <td>
                                                                <div className="flex items-center">
                                                                    <div className="coin-image-wrapper">
                                                                        {watchlistCoin.imageUrl ? (
                                                                            <Image
                                                                                className="object-cover"
                                                                                width={coinSymbolImageSize.width}
                                                                                height={coinSymbolImageSize.height}
                                                                                alt={`Image of ${watchlistCoin.name}`}
                                                                                src={String(watchlistCoin.imageUrl)}
                                                                            />
                                                                        ) : (
                                                                            <div className="coin-letter-mark cursor-pointer">
                                                                                {String(watchlistCoin.symbol)[0]}
                                                                            </div>
                                                                        )}
                                                                    </div>

                                                                    <div className="break-all">{watchlistCoin.name}</div>
                                                                </div>
                                                            </td>

                                                            <td className="text-right">
                                                                {fetchingMarketData === true ? (
                                                                    <Skeleton className="h-[21px] w-[60px] float-right" />
                                                                ) : (
                                                                    watchlistCoin.marketData && (
                                                                        <div className="mr-[2px]">
                                                                            {formatValueIntoCommaSeparated(
                                                                                watchlistCoin.marketData.currentPrice,
                                                                                5,
                                                                                true,
                                                                            )}
                                                                        </div>
                                                                    )
                                                                )}
                                                            </td>

                                                            <td className="text-right">
                                                                {fetchingMarketData === true ? (
                                                                    <Skeleton className="h-[21px] w-[60px] float-right" />
                                                                ) : (
                                                                    watchlistCoin?.marketData?.priceChangePercent[
                                                                        "1hr"
                                                                    ] && (
                                                                        <span
                                                                            className={`flex items-center justify-end ${watchlistCoin.marketData.priceChangePercent["1hr"] > 0 ? "success-text" : "danger-text"}`}
                                                                        >
                                                                            {watchlistCoin.marketData.priceChangePercent[
                                                                                "1hr"
                                                                            ] > 0 ? (
                                                                                <FaCaretUp />
                                                                            ) : (
                                                                                <FaCaretDown />
                                                                            )}
                                                                            {roundOffNumber(
                                                                                watchlistCoin.marketData
                                                                                    .priceChangePercent["1hr"],
                                                                                2,
                                                                            ).toFixed(2) + "%"}
                                                                        </span>
                                                                    )
                                                                )}
                                                            </td>
                                                        </tr>
                                                    }
                                                ></ContextMenuTrigger>

                                                <ContextMenuContent className="z-[201]">
                                                    {watchlistCoinContextMenuList.map(
                                                        (contextMenuItem: Record<string, string>) => {
                                                            return (
                                                                <ContextMenuItem
                                                                    variant={`${contextMenuItem.name === "Delete" ? "destructive" : "default"}`}
                                                                    key={contextMenuItem.id}
                                                                    onSelect={(event) => {
                                                                        onContextMenuItemClicked(
                                                                            watchlistCoin,
                                                                            contextMenuItem,
                                                                            event,
                                                                            "watchlistCoin",
                                                                        );
                                                                    }}
                                                                >
                                                                    {contextMenuItem.name}
                                                                </ContextMenuItem>
                                                            );
                                                        },
                                                    )}
                                                </ContextMenuContent>
                                            </ContextMenu>
                                        );
                                    })}
                                </tbody>
                            </table>
                        ) : (
                            <div className="no-value-text !text-center">No coins added</div>
                        )}
                    </div>
                )}
            </>
        )
    );
}

function DeleteDialog(props: any) {
    const {
        showDeleteDialog,
        setShowDeleteDialog,
        onDeleteBtnClicked,
        deletingItem,
        onDeleteDialogClose,
        rightClickedItem,
        deleteDialogType,
    } = props;

    return (
        <Dialog
            open={showDeleteDialog}
            onOpenChange={(showDeleteDialog) => {
                setShowDeleteDialog(showDeleteDialog);
                if (!showDeleteDialog) onDeleteDialogClose();
            }}
        >
            <DialogContent dialogLevel={2}>
                <DialogHeader disableCloseButton={deletingItem}>
                    <DialogTitle>
                        {deleteDialogType.current === "watchlist" && "Delete Watchlist"}
                        {deleteDialogType.current === "watchlistCoin" && "Remove Coin"}

                        <DialogDescription className="sr-only">watchlist delete dialog</DialogDescription>
                    </DialogTitle>
                </DialogHeader>

                <DialogBody>
                    <h2>
                        {deleteDialogType.current === "watchlist" && "Are you sure you want to delete this watchlist?"}
                        {deleteDialogType.current === "watchlistCoin" && (
                            <div>
                                Are you sure you want to remove this
                                <b className="mx-[4px]">{rightClickedItem.name}</b>
                                from watchlist?
                            </div>
                        )}
                    </h2>
                </DialogBody>

                <DialogFooter className="justify-center">
                    <Button
                        variant={"destructive"}
                        onClick={() => {
                            onDeleteBtnClicked();
                        }}
                        disabled={deletingItem}
                    >
                        {deletingItem && <Spinner />}
                        {deleteDialogType.current === "watchlist" && "Delete"}
                        {deleteDialogType.current === "watchlistCoin" && "Remove"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

function WatchlistDetailsDialog(props: any) {
    const { showWatchlistDetailsDialog, setShowWatchlistDetailsDialog, watchlist } = props;

    return (
        <Dialog
            open={showWatchlistDetailsDialog}
            onOpenChange={setShowWatchlistDetailsDialog}
            closeOnOutsideClick={true}
        >
            <DialogContent dialogLevel={2}>
                <DialogHeader>
                    <DialogTitle>
                        Details
                        <DialogDescription className="sr-only">watchlist details dialog</DialogDescription>
                    </DialogTitle>
                </DialogHeader>

                <DialogBody>
                    <table className="cnv-table">
                        <tbody>
                            <tr>
                                <td>Name</td>

                                <td>{watchlist.name}</td>
                            </tr>

                            <tr>
                                <td>Description</td>

                                <td>{watchlist.description ?? <span className="no-value-text">No Description</span>}</td>
                            </tr>
                        </tbody>
                    </table>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
