import { secretTerminalClient } from "@/lib/api-client";
import { isAxiosError } from "axios";
import { secretTerminalEndpoints } from "@/lib/endpoints";

const retrieveLatestNews = async () => {
    try {
        const response = await secretTerminalClient.get(secretTerminalEndpoints.news.latest);
        return response;
    } catch (error) {
        if (error instanceof Error) throw new Error(error.message);
        if (isAxiosError(error)) throw new Error(error.response?.data.message);
    }
};

export { retrieveLatestNews };
