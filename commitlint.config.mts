import type { UserConfig } from "@commitlint/types";

const config: UserConfig = {
    extends: ["@commitlint/config-conventional"],
    rules: {
        "type-enum": [
            2,
            "always",
            ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"],
        ],
        "header-max-length": [2, "always", 250],
        "scope-case": [2, "always", ["lower-case"]],
        "subject-case": [2, "always", ["lower-case"]],
        "body-leading-blank": [2, "always"],
        "body-max-line-length": [2, "always", 100],
        "footer-leading-blank": [2, "always"],
        "footer-max-line-length": [2, "always", 100],
    },
};

export default config;
