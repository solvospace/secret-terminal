import { AppModule } from "./app.module.js";
import cookie from "@fastify/cookie";
import helmet from "@fastify/helmet";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";

const allowedOrigins =
    process.env.CORS_ORIGINS?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) ?? [];

const companyRegex = process.env.CORS_COMPANY_REGEX ? new RegExp(process.env.CORS_COMPANY_REGEX, "i") : null;
const bodyLimit = Number(process.env.BODY_LIMIT);

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter({
            bodyLimit,
        }),
        {
            rawBody: true,
        },
    );

    app.enableShutdownHooks();

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin) || companyRegex?.test(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"), false);
        },
        credentials: true,
    });

    await app.register(helmet, {
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'", `http://localhost:${process.env.PORT}`],
            },
        },
    });

    await app.register(cookie);

    app.useBodyParser("text/plain");

    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
        }),
    );

    app.setGlobalPrefix("api");
    app.enableVersioning({
        type: VersioningType.URI,
    });

    await app.listen(Number(process.env.PORT ?? 5002), "0.0.0.0");
}

bootstrap();
