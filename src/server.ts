import app from "./app";
import { Config } from "./config";

const startServer =  () => {
    const PORT = Config.PORT;
    try {
        app.listen(Config.PORT, () => {
            // eslint-disable-next-line no-console
            console.log(`Listening on port ${PORT}`);
            
        });
    } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        process.exit(1);
                
        
    }
};


startServer();