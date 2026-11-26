import { existsSync } from "node:fs";
import * as path from "node:path";
import { loadEnvFile } from "node:process";

try {
    const envPath = path.resolve(process.cwd(), ".env");

    if (existsSync(envPath)) {
        loadEnvFile(envPath);
    }
} catch (error: unknown) {
    console.log(error instanceof Error ? error.message : JSON.stringify(error));
}
