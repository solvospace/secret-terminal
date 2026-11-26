import { spawnSync } from "node:child_process";

const configs = ["./drizzle.config.ts"];

try {
    for (const config of configs) {
        for (const action of ["generate", "migrate"]) {
            console.log(`\n${action}: ${config}`);

            const result = spawnSync("pnpm", ["exec", "drizzle-kit", action, `--config=${config}`], { stdio: "inherit" });

            if (result.error) throw result.error;
            if (result.status !== 0) {
                throw new Error(`${action} failed with exit code ${result.status}`);
            }
        }
    }

    console.log("\n ✅ Migrations completed successfully.");
} catch (error) {
    console.error("\nMigration failed:", error);
    process.exitCode = 1;
}
