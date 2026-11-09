import { coinGeckoClient } from "../../integrations/client.js";
import { coinGeckoEndpoints } from "../../integrations/endpoints.js";
import { Injectable } from "@nestjs/common";

@Injectable()
export default class SearchService {
    async search(params: Record<string, string>) {
        const response = await coinGeckoClient.get(coinGeckoEndpoints.coins.search, { params });

        return {
            data: response.data,
        };
    }
}
