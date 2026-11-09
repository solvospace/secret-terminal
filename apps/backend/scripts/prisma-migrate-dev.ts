import { execSync } from "child_process";

const configs = ["./prisma/prisma.config.ts"];

for (const config of configs) {
    execSync(`prisma migrate dev --config=${config}`, {
        stdio: "inherit",
    });
}
