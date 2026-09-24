import Loading from "@/app/loading";
import CoinList from "@/components/features/coins/coin-list";
import { Suspense } from "react";

export async function generateMetadata() {
    return { title: "Coins" };
}

async function Coins() {
    return (
        <Suspense fallback={<Loading />}>
            <CoinList />
        </Suspense>
    );
}

export default Coins;
