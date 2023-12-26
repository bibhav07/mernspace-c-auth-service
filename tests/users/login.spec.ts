import request from "supertest";
import app from "../../src/app";
import { isJwt } from "../utils";
import { AppDataSource } from "../../src/config/data-source";
import { DataSource } from "typeorm";

describe.skip("POST auth/login", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
    });

    afterAll(async () => {
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should retun 200 after loign and attach cookie", async () => {
            //---- arrage
            const userData = {
                email: "by@gmail.com",
                password: "secret",
            };

            //---- act
            const response = await request(app)
                .post("/auth/login")
                .send(userData);

            //---- assert
            interface Headers {
                ["set-cookie"]: string[];
            }

            let accessToken = null;
            let refreshToken = null;

            const cookies =
                (response.headers as unknown as Headers)["set-cookie"] || [];

            cookies.forEach((cookie) => {
                if (cookie.startsWith("accessToken=")) {
                    accessToken = cookie.split(";")[0].split("=")[1];
                }
                if (cookie.startsWith("refreshToken=")) {
                    refreshToken = cookie.split(";")[0].split("=")[1];
                }
            });

            expect(response.statusCode).toBe(200);

            expect(accessToken).not.toBe(null);
            expect(refreshToken).not.toBe(null);

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
    });
});
