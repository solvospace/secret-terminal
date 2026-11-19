import GlobalMarketStats from "@/components/features/global-market/global-market-stats";
import MarketSummary from "@/components/features/market-summary/market-summary";
import TrendingCoinsCategoriesAndNftsContainer from "@/components/features/trending/trending-coins-categories-and-nfts-container";

export default function App() {
    return (
        <>
            <MarketSummary />
            <TrendingCoinsCategoriesAndNftsContainer />
            <GlobalMarketStats />
        </>
    );
}
