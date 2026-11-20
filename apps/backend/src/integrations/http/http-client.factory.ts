import axios from "axios";
import { ConfigService } from "@nestjs/config";

export const createHttpClient = (
    config: ConfigService,
    baseUrlKey: string,
    headers: Record<string, string | undefined>,
) => {
    return axios.create({
        baseURL: config.getOrThrow<string>(baseUrlKey),
        headers,
    });
};
