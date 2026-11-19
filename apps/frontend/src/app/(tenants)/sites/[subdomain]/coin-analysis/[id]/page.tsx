import Loading from "./loading";
import CoinAnalysisContainer from "@/components/features/coin-analysis/coin-analysis-container";
import { Suspense } from "react";

type Props = {
    params: Promise<{ id: string }>;
    searchParams: Promise<Record<string, string | string[]>>;
};

export async function generateMetadata({ params }: Props) {
    const { id } = await params;

    return {
        title: id.charAt(0).toUpperCase() + id.slice(1),
    };
}

async function CoinAnalysis({ params }: Props) {
    const { id } = await params;

    return (
        <Suspense fallback={<Loading />}>
            <CoinAnalysisContainer coinId={id} />
        </Suspense>
    );
}

export default CoinAnalysis;
