import { secretTerminalClient } from "@/lib/api-client";
import { secretTerminalEndpoints } from "@/lib/endpoints";

async function createText({ prompt }: Record<string, string>) {
    try {
        const response = await secretTerminalClient.post(secretTerminalEndpoints.ai.generateText, {
            prompt,
        });
        return response;
    } catch (error) {
        throw error;
    }
}

export { createText };
