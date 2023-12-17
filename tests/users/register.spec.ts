import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
// import { truncateTables } from "../utils";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";

describe("POST /auth/register", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
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
            const userData = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret",
            };
            //---- act
            await request(app).post("/auth/register").send(userData);
            //---- assert

            const userRepo = connection.getRepository(User);
            const users = await userRepo.find();

            expect(users).toHaveLength(1);
            expect(users[0].firstName).toBe(userData.firstName);
            expect(users[0].lastName).toBe(userData.lastName);
            expect(users[0].email).toBe(userData.email);
        });

        it("should return the saved user id and type number", async () => {
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
            expect(response.status).toBe(201);
            expect(response.body).toHaveProperty("id", expect.any(Number));
        });

        it("should have role type as customer only", async () => {
            //---- arrage
            const userData = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret",
            };
            //---- act
            await request(app).post("/auth/register").send(userData);
            //---- assert

            const userRepo = connection.getRepository(User);
            const users = await userRepo.find();

            expect(users[0]).toHaveProperty("role", Roles.CUSTOMER);
        });

        it("should store hashed password", async () => {
            //---- arrage
            const userData = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret",
            };
            //---- act
            await request(app).post("/auth/register").send(userData);
            //---- assert

            const userRepo = connection.getRepository(User);
            const users = await userRepo.find();

            expect(users[0].password).not.toBe(userData.password);
            expect(users[0].password).toHaveLength(60);
            //cheking the password pattern
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/);
        });

        it("should return 400 if email already esists", async () => {
            //---- arrage
            const userData = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret",
            };
            const userRepo = connection.getRepository(User);
            await userRepo.save({ ...userData, role: Roles.CUSTOMER });

            //---- act
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            const users = await userRepo.find();
            //---- assert

            expect(response.statusCode).toBe(400);
            expect(users).toHaveLength(1);
        });
    });

    describe("Fields are missing", () => {});
});
