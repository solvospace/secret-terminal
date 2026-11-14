import { coinGeckoClient } from "../../integrations/client/client.js";
import { coinGeckoEndpoints } from "../../integrations/client/endpoints.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class MarketChartService {
    async retrieveMarketChartData(coinId: string, queryParams: Record<string, string>) {
        const response = await coinGeckoClient.get(`${coinGeckoEndpoints.coins.coinDataById}/${coinId}/market_chart`, {
            params: queryParams,
        });

        return {
            data: response.data,
        };
    }
}
