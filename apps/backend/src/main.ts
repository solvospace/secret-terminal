import "./load-env.js";
import helmet from "helmet";
import { AppModule } from "./app.module.js";
import { HttpExceptionFilter } from "./common/filters/http-exception.filter.js";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor.js";
import { ValidationPipe, VersioningType } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { NodeAdapter, NestNodeApplication } from "@nestjs/platform-node";

const localRegex = process.env.CORS_LOCAL_REGEX ? new RegExp(process.env.CORS_LOCAL_REGEX, "i") : null;
const companyRegexOne = process.env.CORS_COMPANY_REGEX_ONE ? new RegExp(process.env.CORS_COMPANY_REGEX_ONE, "i") : null;
const companyRegexTwo = process.env.CORS_COMPANY_REGEX_TWO ? new RegExp(process.env.CORS_COMPANY_REGEX_TWO, "i") : null;

const bodyLimit = process.env.BODY_LIMIT ?? "1mb";

async function bootstrap() {
    const app = await NestFactory.create<NestNodeApplication>(AppModule, new NodeAdapter(), {
        rawBody: true,
    });

    app.useBodyParser("json", {
        limit: bodyLimit,
    });

    app.useBodyParser("urlencoded", {
        limit: bodyLimit,
        extended: true,
    });

    app.use(
        helmet({
            contentSecurityPolicy: {
                directives: {
                    defaultSrc: ["'self'"],
                    connectSrc: ["'self'", ...(process.env.LOCALHOST_URL ? [process.env.LOCALHOST_URL] : [])],
                },
            },
        }),
    );

    app.enableCors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            if (localRegex?.test(origin) || companyRegexOne?.test(origin) || companyRegexTwo?.test(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"), false);
        },
        credentials: true,
    });

    app.useGlobalFilters(new HttpExceptionFilter());
    app.useGlobalInterceptors(new ResponseInterceptor());

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
        defaultVersion: "1",
    });

    app.enableShutdownHooks();
    await app.listen(Number(process.env.PORT ?? 5002), "0.0.0.0");
}

await bootstrap();
