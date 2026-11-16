import path, { join } from "node:path";
import { ConfigService } from "@nestjs/config";
import { FileTemplateEngine, ResendTransport } from "@nestjs/mail";

const rootDir = path.resolve(import.meta.dirname, "../../");

export const createMailConfig = (config: ConfigService) => ({
    transport: new ResendTransport({
        apiKey: config.getOrThrow<string>("RESEND_API_KEY"),
    }),
    from: config.getOrThrow<string>("FROM_MAIL_ID"),
    templates: new FileTemplateEngine({
        dir: join(rootDir, "integrations/mail/templates"),
        layout: "layout",
        cache: process.env.NODE_ENV === "production",
    }),
});
