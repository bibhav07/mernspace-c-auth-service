import { config } from "dotenv";
import path from "path";

//setting dynamic path of env variables  TEST/DEV/PROD
config({path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) });

const { PORT, NODE_ENV, DB_PORT, DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME } = process.env;

export const Config = { 
    PORT, 
    DB_PORT,
    DB_NAME, 
    DB_HOST, 
    NODE_ENV, 
    DB_USERNAME, 
    DB_PASSWORD, 
};
