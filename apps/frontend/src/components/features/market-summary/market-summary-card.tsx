"use client";

import React, { useState } from "react";
import MarketSummaryCoins from "@/components/features/market-summary/market-summary-coins";
import { Item, ItemContent, ItemTitle } from "@/components/ui/item";
import { MarketSummaryItem } from "@/interfaces/market-summary.interface";
import { ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogDescription } from "@/components/ui/dialog";

type Bindings = {
    marketSummaryItem: MarketSummaryItem;
    marketSummary: MarketSummaryItem[];
};

function MarketSummaryCard(bindings: Bindings) {
    const { marketSummary, marketSummaryItem } = bindings;
    const [showMarketSummaryItemCardDialog, setShowMarketSummaryItemCardDialog] = useState<boolean>(false);

    return (
        <>
            <Item
                key={marketSummaryItem.id}
                className={`item border-[var(--border-color)]
                            ${marketSummary.length === 1 && "max-w-[300px]"} `}
                variant="outline"
            >
                <ItemContent>
                    <ItemTitle className="mb-[8px] text-[12px]">
                        <div>{marketSummaryItem.title}</div>

                        <div
                            onClick={() => {
                                setShowMarketSummaryItemCardDialog(true);
                            }}
                            className="more-link"
                        >
                            More <ChevronRight />
                        </div>
                    </ItemTitle>

                    <MarketSummaryCoins
                        noOfCoins={5}
                        inDialog={false}
                        key={marketSummaryItem.id}
                        marketSummaryItem={marketSummaryItem}
                    />
                </ItemContent>
            </Item>

            <Dialog
                open={showMarketSummaryItemCardDialog}
                onOpenChange={setShowMarketSummaryItemCardDialog}
            >
                <DialogContent aria-describedby={`15 ${marketSummaryItem.title}`}>
                    <DialogHeader>
                        <DialogTitle>
                            <div>{marketSummaryItem.title}</div>

                            <DialogDescription className="text-[11px] m-[4px_0px] sr-only">
                                {marketSummaryItem.title.toLowerCase()} coins dialog.
                            </DialogDescription>
                        </DialogTitle>
                    </DialogHeader>

                    <DialogBody className="whitespace-nowrap">
                        <MarketSummaryCoins
                            noOfCoins={15}
                            inDialog={true}
                            key={marketSummaryItem.id}
                            marketSummaryItem={marketSummaryItem}
                        />
                    </DialogBody>
                </DialogContent>
            </Dialog>
        </>
    );
}

export default React.memo(MarketSummaryCard);
