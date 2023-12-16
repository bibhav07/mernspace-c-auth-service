import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { truncateTables } from "../utils";
import { User } from "../../src/entity/User";

describe("POST /auth/register", () => {

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let connection: DataSource;

    beforeAll( async ()=>{
        connection = await AppDataSource.initialize();
    });

    beforeEach( async () => {
        // database truncatse
        await truncateTables(connection);
    });

    afterAll( async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        //test for status
        it("should return the 201 status code", async () => {
            //A=Arrage, A=Act, A=Assert

            //---- arrage
            const userData = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret",
            };

            //---- act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            //---- assert
            expect(response.statusCode).toBe(201);
        });

        //test for valid json resopnse
        it("should return valid json response", async () => {
            //A=Arrage, A=Act, A=Assert

            //---- arrage
            const userData = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret",
            };

            //---- act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);

            //---- assert
            expect(
                (response.headers as Record<string, string>)["content-type"],
            ).toEqual(expect.stringContaining("json"));
        });

        it("should persist the user in the database", async () => {
            //A=Arrage, A=Act, A=Assert
            //---- arrage
            const userData  = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret"
            }
            //---- act
            await request(app).post("/auth/register").send(userData);
            //---- assert
            
            const userRepo = connection.getRepository(User);
            const users = await userRepo.find();

            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
            expect(users[0].password).toBe(userData.password);
        
        });
    });

    describe("Fields are missing", () => {});
});
