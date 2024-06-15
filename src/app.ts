import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "./config/logges";
import { HttpError } from "http-errors";
import cors from "cors";
import authRouter from "./routes/auth";
import tenantRouter from "./routes/tenant";
import userRouers from "./routes/user";

const app = express();

app.use(
    cors({
        origin: ["http://localhost:5174", "http://localhost:5173"],
        credentials: true,
    }),
);
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
app.get("/", (req, res) => {
    res.send("welcome to auth service....");
});

app.use("/auth", authRouter);
app.use("/users", userRouers);
app.use("/tenants", tenantRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(error.message);
    const statusCode = error.statusCode || error.status || 500;
    res.status(statusCode).json({
        errors: [
            {
                type: error.name,
                msg: error.message,
                path: "",
                location: "",
            },
        ],
    });
});

export default app;
