import app from "./app";
import { Config } from "./config";
import { AppDataSource } from "./config/data-source";
import logger from "./config/logges";

const startServer = async () => {
    const PORT = Config.PORT;
    try {
        await AppDataSource.initialize();
        logger.info(`database connected succesfully...`);
        app.listen(Config.PORT, () => {
            logger.info(`Listening on port ${PORT}`);
        });
    } catch (error: unknown) {
        // eslint-disable-next-line no-console
        // console.log(error);
        if (error instanceof Error) {
            logger.error(error.message);

            setTimeout(() => {
                process.exit(1);
            }, 2000);
        }
    }
};

void startServer();
