// import request from "supertest";
// import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
// import { truncateTables } from "../utils";
// import { User } from "../../src/entity/User";


describe("POST auth/login", () => {

    let connection: DataSource;

    beforeAll( async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach( async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll( async () => {
        await connection.destroy();
    });

    describe.skip("Given all fields", () => {
        it("should retun ...... after successful login", () => {});
    })

    describe.skip("Missing fields", () => {
        it.skip("Should return 400 if email not provided", () => {});
        it.skip("Should return 400 if password not provided", () => {});
    })

});


