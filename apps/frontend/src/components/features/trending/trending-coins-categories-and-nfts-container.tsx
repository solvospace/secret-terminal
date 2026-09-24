"use client";

import useTrendingCoinsCategoriesAndNfts from "@/hooks/use-trending-coins-categories-and-nfts";
import TrendingCoinsCategoriesAndNftsTable from "@/components/features/trending/trending-coins-categories-and-nfts-table";
import { TrendingCoinsCategoriesAndNftsClient } from "@/interfaces/trending.interface";
import { Skeleton } from "@/components/ui/skeleton";

function TrendingCoinsCategoriesAndNftsContainer() {
    const { fetchingTrendingCoinsCategoriesAndNfts, trendingCoinsCategoriesAndNfts } =
        useTrendingCoinsCategoriesAndNfts();

    return (
        <>
            <div className="text-[20px] font-medium mb-[12px]">Trending</div>

            <div className="trending-coins-categories-and-nfts-container">
                {fetchingTrendingCoinsCategoriesAndNfts
                    ? [...Array(3)].map((_, index) => {
                          return (
                              <Skeleton
                                  key={"indicator" + index}
                                  className="min-w-[200px] item h-[262px]"
                              />
                          );
                      })
                    : trendingCoinsCategoriesAndNfts.map((trendingItem: TrendingCoinsCategoriesAndNftsClient) => {
                          return (
                              <div
                                  key={trendingItem.id}
                                  className="item relative"
                              >
                                  <h6 className="text-[12px] mb-[12px]">{trendingItem.header}</h6>

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
        </>
    );
}

export default TrendingCoinsCategoriesAndNftsContainer;
