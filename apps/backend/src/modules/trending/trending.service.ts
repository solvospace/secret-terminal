import { isAxiosError } from "axios";
import { coinGeckoClient } from "../../lib/api-client.js";
import { coinGeckoEndpoints } from "../../lib/endpoints.js";
import appHttpStatus from "../../constants/http-status-code.js";
import { handleFailure } from "../../services/handle-response.service.js";

async function retrieveTrendingData() {
    try {
        const response = await coinGeckoClient.get(coinGeckoEndpoints.coins.trending);
        const trendingData = response.data;
        return {
            status: appHttpStatus.ok,
            data: trendingData,
        };
    } catch (error: unknown) {
        throw error;
    }
}

const TrendingService = {
    retrieveTrendingData,
};

export default TrendingService;
