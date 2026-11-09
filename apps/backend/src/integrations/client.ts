import axios from "axios";

const coinGeckoClient = axios.create({
    baseURL: process.env.COI,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY,
    },
});

export { coinGeckoClient };
