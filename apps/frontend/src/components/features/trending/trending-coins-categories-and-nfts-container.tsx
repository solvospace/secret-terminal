"use client";

import TrendingCoinsCategoriesAndNftsTable from "@/components/features/trending/trending-coins-categories-and-nfts-table";
import useTrendingCoinsCategoriesAndNfts from "@/hooks/use-trending-coins-categories-and-nfts";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingCoinsCategoriesAndNftsClient } from "@/interfaces/trending.interface";

function TrendingCoinsCategoriesAndNftsContainer() {
    const { fetchingTrendingCoinsCategoriesAndNfts, trendingCoinsCategoriesAndNfts } =
        useTrendingCoinsCategoriesAndNfts();

    return (
        <section className="trending-container">
            <h2 className="t-heading">Trending</h2>

            <div className="t-body">
                {fetchingTrendingCoinsCategoriesAndNfts
                    ? [...Array(3)].map((_, index) => {
                          return (
                              <Skeleton
                                  key={"indicator" + index}
                                  className="group"
                              />
                          );
                      })
                    : trendingCoinsCategoriesAndNfts.map((trendingItem: TrendingCoinsCategoriesAndNftsClient) => {
                          return (
                              <div
                                  key={trendingItem.id}
                                  className="group"
                              >
                                  <h6 className="header">{trendingItem.header}</h6>

                                  {trendingItem.list.length > 0 ? (
                                      <TrendingCoinsCategoriesAndNftsTable
                                          type={trendingItem.type}
                                          list={trendingItem.list}
                                      />
                                  ) : (
                                      <div className="no-value-text !text-center hz-and-vert-center">
                                          No {trendingItem.header}
                                      </div>
                                  )}
                              </div>
                          );
                      })}
            </div>
        </section>
    );
}

export default TrendingCoinsCategoriesAndNftsContainer;
