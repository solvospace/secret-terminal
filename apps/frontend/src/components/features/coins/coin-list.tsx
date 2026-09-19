"use client";

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { columns } from "@/components/features/coins/columns";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getRowsPerPageDefaultValue } from "@secret-terminal/services/utils.service";
import { coinsTableContextMenuList } from "@/constants/app.constants";
import useCoinList from "@/hooks/use-coin-list";
import DataTable from "@/components/features/coins/data-table";
import CoinDetailsDialog from "@/components/features/coin-details/coin-details-dialog";
import { StCoin } from "@secret-terminal/types/coin-list.types";

function CoinList() {
    const {
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
    } = useCoinList();

    return (
        <>
            <div className="coins-sst-container">
                <div className="search-and-filters-wrapper">
                    <div className="st-select-group">
                        <Select
                            defaultValue={String(getRowsPerPageDefaultValue())}
                            onValueChange={(value) => {
                                onRowsPerPageChange(value as string);
                            }}
                            disabled={fetchingCoinList}
                        >
                            <SelectTrigger aria-label="Rows per page">
                                <SelectValue />
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    {rowsPerPageListRef.current.map((rowsPerPage) => {
                                        return (
                                            <SelectItem
                                                key={rowsPerPage + "-rows"}
                                                value={String(rowsPerPage)}
                                            >
                                                {rowsPerPage}
                                            </SelectItem>
                                        );
                                    })}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="search-group">
                        <InputGroup className="input-group">
                            <InputGroupInput
                                className="!text-[13px]"
                                placeholder="Search Coin Name"
                                value={searchValue}
                                onChange={(event) => {
                                    onSearchInputChange(event);
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
                    </div>
                </div>

                <DataTable<StCoin>
                    list={coinList}
                    columns={columns}
                    contextMenuList={coinsTableContextMenuList}
                    listEmptyMessage={"No coins found."}
                    fetchingList={fetchingCoinList}
                    currentPageNumber={currentPageNumber}
                    rowsPerPage={rowsPerPage}
                    currentSortingValue={sortingValue}
                    sendSortingValueToParent={setSortingValueFromDt}
                    onRowClicked={onRowClicked}
                    onContextMenuItemClicked={onContextMenuItemClicked}
                />

                <div className="bottom-bar">
                    <div className="pagination-btn-group">
                        <Button
                            variant="outline"
                            size="sm"
                            aria-label="previous button"
                            onClick={() => {
                                setCurrentPageNumber(currentPageNumber - 1);
                            }}
                            disabled={currentPageNumber === 1 || fetchingCoinList}
                        >
                            Previous
                        </Button>

                        <Button
                            variant="outline"
                            size="sm"
                            aria-label="close button"
                            onClick={() => {
                                setCurrentPageNumber((prev) => prev + 1);
                            }}
                            disabled={coinList.length < rowsPerPage || fetchingCoinList}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>

            <CoinDetailsDialog
                coin={clickedCoinRef.current}
                showDialog={showCoinDetailsDialog}
                setShowDialog={setShowCoinDetailsDialog}
            />
        </>
    );
}

export default CoinList;
