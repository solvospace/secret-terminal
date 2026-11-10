import axios from "axios";
import { existsSync } from "node:fs";
import * as path from "node:path";
import { loadEnvFile } from "node:process";

const envPath = path.resolve(process.cwd(), ".env");

if (existsSync(envPath)) {
    loadEnvFile(envPath);
}

const coinGeckoClient = axios.create({
    baseURL: process.env.COIN_GECKO_BASE_URL,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "x-cg-demo-api-key": process.env.COIN_GECKO_API_KEY,
    },
});

export { coinGeckoClient };
