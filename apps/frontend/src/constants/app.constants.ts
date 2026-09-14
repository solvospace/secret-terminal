import { NavigationBarTab } from "@/interfaces/global.interface";
import { Home, TrendingUp, Newspaper, BookmarkPlus, ChartNoAxesColumn, LucideIcon } from "lucide-react";

const coinKeyList = [
    {
        name: "Market Cap.",
        key: "marketCapital",
        toolTipValue: `Refers to the total market value of a cryptocurrency’s circulating supply. It is similar to the\
        stock market’s measurement of multiplying price per share by shares readily available in the market (not held\
        & locked by insiders, governments).

        Market Cap = Current Price x Circulating Supply.`,
    },
    {
        name: "Fully Diluted Valuation",
        key: "fullyDilutedCoin",
        toolTipValue: `Fully Diluted Valuation (FDV) = Current Price x Total Supply.
                \nFully Diluted Valuation (FDV) is the theoretical market capitalization of a coin if the entirety\
                of its supply is in circulation, based on its current market price. The FDV value is theoretical as\
                increasing the circulating supply of a coin may impact its market price. Also depending on the\
                tokenomics, emission schedule or lock-up period of a coin's supply, it may take a significant time\
                before its entire supply is released into circulation.`,
    },
    {
        name: "Circulating Supply",
        key: "circulatingSupply",
        toolTipValue: `The amount of coins that are circulating in the market and are tradeable by the public. It is\
        comparable to looking at shares readily available in the market (not held & locked by insiders, governments).`,
    },
    {
        name: "Total Supply",
        key: "totalSupply",
        toolTipValue: `The amount of coins that have already been created, minus any coins that have been burned\
                        (removed from circulation).\ It is comparable to outstanding shares in the stock market.
                        \nTotal Supply = Onchain supply - burned tokens.`,
    },
    {
        name: "Max. Supply",
        key: "maximumSupply",
        toolTipValue: `The maximum number of coins coded to exist in the lifetime of the cryptocurrency. It is\
                        comparable to the maximum number of issuable shares in the stock market.
                        \nMax Supply = Theoretical maximum as coded.`,
    },
    {
        name: "Total Volume",
        key: "totalVolume",
        toolTipValue: `the total amount of a specific digital asset bought and sold on exchanges within a specific timeframe,\ most commonly measured over 24 hours.`,
    },
];

const coinsTableContextMenuList: Record<string, string>[] = ["View Details", "Analyze Coin"].map((name) => {
    return { id: crypto.randomUUID(), name };
});

const navigationBarTabList: NavigationBarTab[] = [
    { name: "Home", value: "home" },
    { name: "Trending", value: "trending" },
    { name: "News", value: "news" },
    { name: "Watchlist", value: "watchlist" },
    { name: "Analysis", value: "coin-analysis" },
].map((tab) => {
    return {
        id: crypto.randomUUID(),
        name: tab.name,
        value: tab.value,
        disabled: false,
        icon: getIcon(tab.value),
    };
});

function getIcon(value: string): LucideIcon {
    switch (value) {
        case "home":
            return Home;
        case "trending":
            return TrendingUp;
        case "news":
            return Newspaper;
        case "watchlist":
            return BookmarkPlus;
        case "coin-analysis":
            return ChartNoAxesColumn;
        case "home":
            return Home;
        default:
            return Home;
    }
}

const coinSymbolImageSize = {
    width: 26,
    height: 26,
};

const userScreenWidth = 720;
const iconSize = 18;

export { coinKeyList, coinsTableContextMenuList, navigationBarTabList, coinSymbolImageSize, userScreenWidth, iconSize };
