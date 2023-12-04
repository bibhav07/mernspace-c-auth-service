import winston from "winston";
import { Config } from ".";

const logger = winston.createLogger({
    level: "info",
    defaultMeta: {
        serviceName: "auth-service",
    },
    transports: [
        new winston.transports.File({
            dirname: "logs",
            filename: "combine.log",
            level: "info",
            silent: Config.NODE_ENV === "true",
        }),
        new winston.transports.File({
            dirname: "logs",
            filename: "error.log",
            level: "error",
            silent: Config.NODE_ENV === "true",
        }),
        new winston.transports.Console({
            level: "info",
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
            silent: Config.NODE_ENV === "true",
        }),
    ],
});

export default logger;
