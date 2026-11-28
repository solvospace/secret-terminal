import { spawnSync } from "node:child_process";

const configs = ["./drizzle.config.ts"];
const actions = ["generate", "migrate"];

try {
    for (const config of configs) {
        for (const action of actions) {
            console.log(`\n${action}: ${config}`);

            const result = spawnSync("pnpm", ["exec", "drizzle-kit", action, `--config=${config}`], {
                encoding: "utf-8",
                stdio: ["inherit", "pipe", "pipe"],
            });

            if (result.error) {
                throw result.error;
            }

            if (result.stdout) {
                process.stdout.write(result.stdout);
            }

            if (result.stderr) {
                process.stderr.write(result.stderr);
            }

            if (result.status !== 0) {
                throw new Error(`${action} failed with exit code ${result.status ?? "unknown"}`);
            }
        }
    }

    console.log("\n✅ Migrations completed successfully.");
} catch (error) {
    console.error("\nMigration failed:", error);
    process.exitCode = 1;
}
