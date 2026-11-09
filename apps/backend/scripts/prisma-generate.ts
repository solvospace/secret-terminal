import { execSync } from "child_process";

const schemas = ["./prisma"];

for (const schema of schemas) {
    execSync(`prisma generate --schema=${schema}`, {
        stdio: "inherit",
    });
}
