import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import { connectDatabases } from "./config/db.js";
import v1Routes from "./routes/v1/index.js";

await connectDatabases();

const app = express();

const BODY_LIMIT = "2mb";

const allowedOrigins =
    process.env.CORS_ORIGINS?.split(",")
        .map((origin) => origin.trim())
        .filter(Boolean) || [];

const companyRegex = process.env.CORS_COMPANY_REGEX ? new RegExp(process.env.CORS_COMPANY_REGEX, "i") : null;

app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) {
                return callback(null, true);
            }

            if (allowedOrigins.includes(origin)) {
                return callback(null, true);
            }

            if (companyRegex?.test(origin)) {
                return callback(null, true);
            }

            return callback(new Error("Not allowed by CORS"));
        },
        credentials: true,
    }),
);

app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                connectSrc: ["'self'", "http://localhost:5000"],
            },
        },
    }),
);

app.use(express.json({ limit: BODY_LIMIT }));

app.use(
    express.urlencoded({
        extended: true,
        limit: BODY_LIMIT,
    }),
);

app.use(express.text({ limit: BODY_LIMIT }));

app.use(express.raw({ limit: BODY_LIMIT }));

app.use(cookieParser());

app.use("/api/v1", v1Routes);

export default app;
