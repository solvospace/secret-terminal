import MarketSummary from "@/components/features/market-summary/market-summary";
import TrendingCoinsCategoriesAndNftsContainer from "@/components/features/trending/trending-coins-categories-and-nfts-container";

export default function Home() {
    return (
        <>
            <MarketSummary />
            <TrendingCoinsCategoriesAndNftsContainer />
        </>
    );
}
