import { CoingeckoCoin, CoinListApiParams } from "@secret-terminal/types/coin-list.types";
import { coinGeckoClient } from "../../lib/api-client.js";
import { coinGeckoEndpoints } from "../../lib/endpoints.js";
import { getRowsPerPageDefaultValue } from "@secret-terminal/services/utils.service";
import { CoinDetailsServerResponse } from "@secret-terminal/types/coin-details.types";
import { cleanResponse } from "../../services/clean-response.service.js";
import appHttpStatus from "../../constants/http-status-code.js";

async function retrieveCoinList(params: CoinListApiParams) {
    const queryParams: CoinListApiParams = {
        vs_currency: "usd",
        precision: params.precision ? params.precision : "3",
        symbols: params.symbols ? params.symbols : null,
        page: params.page ? Number(params.page) : 1,
        per_page: params.per_page ? Number(params.per_page) : getRowsPerPageDefaultValue(),
        price_change_percentage: "1h,24h,7d,14d,30d,200d,1y",
        order: params.order ? params.order : "market_cap_desc",
        names: params.names ? params.names : null,
        ids: params.ids ? params.ids : null,
    };

    try {
        const response = await coinGeckoClient.get(coinGeckoEndpoints.coins.coinListWithMarketData, {
            params: queryParams,
        });

        const coinList = cleanResponse(createCoinList(response.data));
        return {
            status: appHttpStatus.ok,
            data: coinList,
        };
    } catch (error) {
        throw error;
    }
}

async function retrieveCoinById(id: string) {
    try {
        const response = await coinGeckoClient.get(`${coinGeckoEndpoints.coins.coinDataById}/${id}`);
        return {
            status: appHttpStatus.ok,
            data: createCoinProperties(response.data),
        };
    } catch (error) {
        throw error;
    }
}

function createCoinProperties(serverCoinProperties: CoinDetailsServerResponse) {
    return {
        id: serverCoinProperties.id,
        name: serverCoinProperties.name,
        symbol: serverCoinProperties.symbol,
        description: serverCoinProperties.description.en,
        imageUrl: serverCoinProperties.image.large,
        websiteUrl: serverCoinProperties.links.homepage[0],
        socialLinks: [
            { name: "Reddit", url: serverCoinProperties.links.subreddit_url },
            { name: "Github", url: serverCoinProperties.links.repos_url.github[0] },
        ],
        currentPrice: serverCoinProperties.market_data.current_price.usd,
    };
}

function createCoinList(serverCoins: CoingeckoCoin[]) {
    return serverCoins.map((serverCoin) => {
        return {
            id: serverCoin.id,
            name: serverCoin.name,
            symbol: serverCoin.symbol,
            imageUrl: serverCoin.image,
            currentPrice: serverCoin.current_price,
            marketCapital: serverCoin.market_cap,
            circulatingSupply: serverCoin.circulating_supply,
            fullyDilutedCoin: serverCoin.fully_diluted_valuation,
            totalVolume: serverCoin.total_volume,
            marketCapRank: serverCoin.market_cap_rank,
            totalSupply: serverCoin.total_supply,
            maximumSupply: serverCoin.max_supply,
            priceChangePercent: {
                "1hr": serverCoin.price_change_percentage_1h_in_currency,
                "24hr": serverCoin.price_change_percentage_24h_in_currency,
                "14d": serverCoin.price_change_percentage_14d_in_currency,
                "30d": serverCoin.price_change_percentage_30d_in_currency,
                "7d": serverCoin.price_change_percentage_7d_in_currency,
                "200d": serverCoin.price_change_percentage_200d_in_currency,
                "1y": serverCoin.price_change_percentage_1y_in_currency,
            },
        };
    });
}

const CoinService = {
    retrieveCoinList,
    retrieveCoinById,
};

export default CoinService;
