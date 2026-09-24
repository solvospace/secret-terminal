import MarketSummary from "@/components/features/market-summary/market-summary";
import CoinList from "@/components/features/coins/coin-list";
import TrendingCoinsCategoriesAndNftsContainer from "@/components/features/trending/trending-coins-categories-and-nfts-container";

export default function Home() {
    return (
        <>
            <MarketSummary />
            <TrendingCoinsCategoriesAndNftsContainer />
        </>
    );
}
