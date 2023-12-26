import "reflect-metadata";
import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logges";
import { HttpError } from "http-errors";
import authRouter from "./routes/auth";

const app = express();

app.use(express.json());

app.get("/", async (req, res) => {
    // const err = createHttp(401, "error");
    // return next(err);
    res.send("welcome to auth service....");
});

app.use("/auth", authRouter);

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: HttpError, req: Request, res: Response, next: NextFunction) => {
    logger.error(error.message);
    const statusCode = error.statusCode || 500;
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
