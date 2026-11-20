import { coinGeckoEndpoints } from "../../integrations/http/endpoints.js";
import { HTTP_CLIENTS } from "@/integrations/http/http.tokens.js";
import { Inject, Injectable } from "@nestjs/common";
import type { AxiosInstance } from "axios";

@Injectable()
export default class MarketChartService {
    constructor(
        @Inject(HTTP_CLIENTS.COINGECKO)
        private readonly coinGeckoClient: AxiosInstance,
    ) {}

    async retrieveMarketChartData(coinId: string, queryParams: Record<string, string>) {
        const response = await this.coinGeckoClient.get(
            `${coinGeckoEndpoints.coins.coinDataById}/${coinId}/market_chart`,
            {
                params: queryParams,
            },
        );

        return {
            data: response.data,
        };
    }
}
