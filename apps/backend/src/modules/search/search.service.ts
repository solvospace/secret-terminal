import { isAxiosError } from "axios";
import { coinGeckoClient } from "../../lib/api-client.js";
import { coinGeckoEndpoints } from "../../lib/endpoints.js";
import appHttpStatus from "../../constants/http-status-code.js";

async function search(params: any) {
    try {
        const response = await coinGeckoClient.get(coinGeckoEndpoints.coins.search, { params });
        const searchedCoins = response.data;
        return {
            status: appHttpStatus.ok,
            data: searchedCoins,
        };
    } catch (error: unknown) {
        throw error;
    }
}

const SearchService = {
    search,
};

export default SearchService;
