import express from "express";
import cors from "cors";
import { connectDatabases } from "./config/db.js";
import cookieParser from "cookie-parser";
import v1Routes from "./routes/v1/index.js";
import helmet from "helmet";

await connectDatabases();

const app = express();
app.use(express.json());
app.use(cookieParser());

const vercelRegex = /^https:\/\/.*solvospace\.vercel\.app$/i;

app.use(
    cors({
        origin: [
            "http://localhost:3000",
            "https://www.secretterminal.com",
            "https://app.secretterminal.com",
            "https://www.app.secretterminal.com",
            "https://secret-terminal-dev.vercel.app",
            vercelRegex,
        ],
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

const BODY_LIMIT = "2mb";

app.use(express.json({ limit: BODY_LIMIT }));
app.use(
    express.urlencoded({
        extended: true,
        limit: BODY_LIMIT,
    }),
);
app.use(express.text({ limit: BODY_LIMIT }));
app.use(express.raw({ limit: BODY_LIMIT }));

app.use("/api/v1", v1Routes);

export default app;
