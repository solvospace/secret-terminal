const secretTerminalEndpoints = {
    auth: {
        signUp: "v1/auth/sign-up",
        signIn: "v1/auth/sign-in",
        signOut: "v1/auth/sign-out",
        refreshToken: "v1/auth/refresh-token",
        forgotPassword: "v1/auth/forgot-password",
        verifyResetCode: "v1/auth/verify-reset-code",
        changePassword: "v1/auth/change-password",
        verifyAccount: "v1/auth/verify-account",
    },
    users: {
        me: "v1/users/me",
    },
    news: {
        latest: "v1/news/latest",
    },
    coins: {
        coinList: "v1/coins",
        trending: "v1/trending",
        globalMarket: "v1/global-market",
        search: "v1/search",
        marketChart: "v1/market-chart",
    },
    watchlists: "v1/watchlists",
    watchlistCoins: "v1/watchlistCoins",
};

const binanceEndpoints = {
    coins: {
        exchangeInfo: "v3/exchangeInfo",
        "24hrPriceChangeStats": "v3/ticker/24hr",
    },
};

export { secretTerminalEndpoints, binanceEndpoints };
