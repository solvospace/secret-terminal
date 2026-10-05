import { isAxiosError } from "axios";
import { coinGeckoClient } from "../../lib/api-client.js";
import { coinGeckoEndpoints } from "../../lib/endpoints.js";
import appHttpStatus from "../../constants/http-status-code.js";

async function retrieveMarketChartData(coinId: string, queryParams: any) {
    try {
        const response = await coinGeckoClient.get(`${coinGeckoEndpoints.coins.coinDataById}/${coinId}/market_chart`, {
            params: queryParams,
        });
        return {
            status: appHttpStatus.ok,
            data: response.data,
        };
    } catch (error: unknown) {
        throw error;
    }
}

const MarketChartService = {
    retrieveMarketChartData,
};

export default MarketChartService;
