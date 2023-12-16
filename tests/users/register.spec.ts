import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
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
            // const userData  = {
            //     firstName: "Bibhav",
            //     lastName: "Y",
            //     email: "by@gmail.com",
            //     password: "secret"
            // }
            //---- act
            // const response = await request(app).post("/auth/register").send(userData);
            //---- assert
        });
    });

    describe("Fields are missing", () => {});
});
