import { coinGeckoEndpoints } from "../../integrations/http/endpoints.js";
import { HTTP_CLIENTS } from "@/integrations/http/http.tokens.js";
import { Inject, Injectable } from "@nestjs/common";
import type { AxiosInstance } from "axios";

@Injectable()
export default class TrendingService {
    constructor(
        @Inject(HTTP_CLIENTS.COINGECKO)
        private readonly coinGeckoClient: AxiosInstance,
    ) {}
    async retrieveTrendingData() {
        const response = await this.coinGeckoClient.get(coinGeckoEndpoints.coins.trending);

        return {
            data: response.data,
        };
    }
}
