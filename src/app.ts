import express, { NextFunction, Request, Response } from "express";
import logger from "./config/logges";
import { HttpError } from "http-errors";
import createHttp from "http-errors";

const app = express();

app.get("/", async (req, res, next) => {
    const err = createHttp(401, "errrooorororo");
    return next(err);
    // res.send("welcome to auth service....");
});

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
