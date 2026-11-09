import { execSync } from "child_process";

const configs = ["./prisma/prisma.config.ts"];

for (const config of configs) {
    execSync(`prisma migrate deploy --config=${config}`, {
        stdio: "inherit",
    });
}
