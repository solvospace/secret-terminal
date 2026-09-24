"use client";

import useMarketSummary from "@/hooks/use-market-summary";
import { Skeleton } from "@/components/ui/skeleton";
import MarketSummaryCard from "@/components/features/market-summary/market-summary-card";

function MarketSummary() {
    const { marketSummary, fetchingMarketSummary } = useMarketSummary();

    return (
        <>
            <div className="text-[20px] font-medium mb-[12px]">Overview</div>

            <div className="market-summary-body">
                {fetchingMarketSummary
                    ? [...Array(3)].map((_, index) => {
                          return (
                              <Skeleton
                                  key={"indicator" + index}
                                  className="min-w-[200px] item h-[262px]"
                              />
                          );
                      })
                    : marketSummary.length > 0 &&
                      marketSummary.map((marketSummaryItem) => {
                          return (
                              marketSummaryItem.show && (
                                  <MarketSummaryCard
                                      key={marketSummaryItem.id}
                                      marketSummary={marketSummary}
                                      marketSummaryItem={marketSummaryItem}
                                  />
                              )
                          );
                      })}
            </div>
        </>
    );
}

export default MarketSummary;
