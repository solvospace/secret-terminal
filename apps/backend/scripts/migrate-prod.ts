import { spawnSync } from "node:child_process";

const configs = ["./drizzle.config.ts"];

try {
    for (const config of configs) {
        console.log(`\nDeploying migrations for: ${config}`);

        const result = spawnSync("pnpm", ["exec", "drizzle-kit", "migrate", `--config=${config}`], { stdio: "inherit" });

        if (result.error) throw result.error;
        if (result.status !== 0) {
            throw new Error(`Migration failed with exit code ${result.status}`);
        }
    }

    console.log("\n ✅ Production migrations deployed successfully.");
} catch (error) {
    console.error("\nProduction migration failed:", error);
    process.exitCode = 1;
}
