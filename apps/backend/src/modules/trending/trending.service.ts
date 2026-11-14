import { coinGeckoClient } from "../../integrations/client/client.js";
import { coinGeckoEndpoints } from "../../integrations/client/endpoints.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class TrendingService {
    async retrieveTrendingData() {
        const response = await coinGeckoClient.get(coinGeckoEndpoints.coins.trending);

        return {
            data: response.data,
        };
    }
}
