import "reflect-metadata";
import { DataSource } from "typeorm";
import { Config } from ".";

/**
 * make migrations : npm run migration:generate -- src/migration/create_tenants_table -d src/config/data-source.ts
 * run migrations : npm run migration:run -- -d .\src\config\data-source.ts
 *
 * */

export const AppDataSource = new DataSource({
    type: "postgres",
    host: Config.DB_HOST,
    port: Number(Config.DB_PORT),
    username: Config.DB_USERNAME,
    password: Config.DB_PASSWORD,
    database: Config.DB_NAME,
    //keep false in prod
    synchronize: false,
    logging: false,
    // entities: [User, RefreshToken, Tenants],
    entities: ["src/entity/*.{ts,js}"],
    migrations: ["src/migration/*.{ts,js}"],
    subscribers: [],
});
