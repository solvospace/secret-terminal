import type { GlobalMarketApiData } from "@secret-terminal/types/global-market.types";

import { coinGeckoClient } from "../../integrations/client.js";
import { coinGeckoEndpoints } from "../../integrations/endpoints.js";
import { Injectable } from "@nestjs/common";
import { formatValueIntoCommaSeparated, roundOffNumber } from "@secret-terminal/services/utils.service";

@Injectable()
export default class GlobalMarketService {
    async retrieveGlobalMarketData() {
        const response = await coinGeckoClient.get(coinGeckoEndpoints.coins.globalMarket);
        const globalMarketData = this.createGlobalMarketStatistics(response.data.data);

        return {
            data: globalMarketData,
        };
    }

    private createMarketCapShareList(marketCapSharePercentProperties: Record<string, number>) {
        return Object.entries(marketCapSharePercentProperties)
            .sort((a, b) => b[1] - a[1])
            .map(([name, value]) => ({
                name: name.toUpperCase(),
                value: `${roundOffNumber(value, 2)}%`,
            }));
    }

    private createGlobalMarketStatistics(globalMarketData: GlobalMarketApiData) {
        return {
            totalCoins: formatValueIntoCommaSeparated(globalMarketData.active_cryptocurrencies),
            exchanges: formatValueIntoCommaSeparated(globalMarketData.markets),
            totalMarketCapital: {
                value: globalMarketData.total_market_cap.usd,
                marketCapShareList: this.createMarketCapShareList(globalMarketData.market_cap_percentage),
            },
            marketCapitalChangePercentage24hUsd: globalMarketData.market_cap_change_percentage_24h_usd,
            volumeChangePercentage24hUsd: globalMarketData.volume_change_percentage_24h_usd,
            totalVolume: globalMarketData.total_volume.usd,
            lastUpdatedAt: new Date(globalMarketData.updated_at * 1000),
        };
    }
}
