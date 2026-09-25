import MarketSummary from "@/components/features/market-summary/market-summary";
import TrendingCoinsCategoriesAndNftsContainer from "@/components/features/trending/trending-coins-categories-and-nfts-container";
import GlobalMarketStats from "@/components/features/global-market/global-market-stats";

export default function Home() {
    return (
        <>
            <MarketSummary />
            <TrendingCoinsCategoriesAndNftsContainer />
            <GlobalMarketStats />
        </>
    );
}
