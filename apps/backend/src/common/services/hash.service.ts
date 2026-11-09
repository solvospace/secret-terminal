import bcrypt from "bcrypt";

async function generateHash(content: string) {
    if (!content) {
        throw new Error("No content.");
    }

    const hashed = await bcrypt.hash(content, 10);
    return hashed;
}

async function compareHashed(content: string, hashed: string) {
    if (!content) {
        throw new Error("No content.");
    }

    const matched = await bcrypt.compare(content, hashed);
    return matched;
}

const HashService = { generateHash, compareHashed };

export default HashService;
