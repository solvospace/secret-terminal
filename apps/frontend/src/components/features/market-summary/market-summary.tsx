"use client";

import MarketSummaryCard from "@/components/features/market-summary/market-summary-card";
import useMarketSummary from "@/hooks/use-market-summary";
import { Skeleton } from "@/components/ui/skeleton";

function MarketSummary() {
    const { marketSummary, fetchingMarketSummary } = useMarketSummary();

    return (
        <section className="market-summary-container">
            <h2 className="ms-heading">Overview</h2>

            <div className="ms-body">
                {fetchingMarketSummary
                    ? [...Array(3)].map((_, index) => {
                          return (
                              <Skeleton
                                  key={"indicator" + index}
                                  className="group"
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
        </section>
    );
}

export default MarketSummary;
