import app from "./app";
import { Config } from "./config";
import logger from "./config/logges";

const startServer = () => {
    const PORT = Config.PORT;
    try {

        app.listen(Config.PORT, () => {
            // logger.debug('hola....boom')
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

startServer();
