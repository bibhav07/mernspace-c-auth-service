import request from "supertest";
import app from "../../src/app";
import { isJwt } from "../utils";
import { AppDataSource } from "../../src/config/data-source";
import { DataSource } from "typeorm";
import { RefreshToken } from "../../src/entity/RefreshToken";

describe("POST auth/login", () => {
    let connection: DataSource;

    beforeAll(async () => {
        connection = await AppDataSource.initialize();
        const refRepo = AppDataSource.getRepository(RefreshToken);
        await refRepo.delete({});
        await connection.synchronize();
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

            const refreshTokenRepo = connection.getRepository(RefreshToken);

            const tokens = await refreshTokenRepo
                .createQueryBuilder("refToken")
                .where("refToken.userId = :userId", {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany();

            expect(tokens).toHaveLength(1);

            expect(response.statusCode).toBe(200);

            expect(accessToken).not.toBe(null);
            expect(refreshToken).not.toBe(null);

            expect(isJwt(accessToken)).toBeTruthy();
            expect(isJwt(refreshToken)).toBeTruthy();
        });
    });

    describe("Missing fields", () => {
        it("should return 400 is no email", async () => {
            //---- arrage
            const userData = {
                email: "",
                password: "secret",
            };

            //---- act
            const response = await request(app)
                .post("/auth/login")
                .send(userData);

            expect(response.statusCode).toBe(400);
        });
        it("should return 400 is no password", async () => {
            //---- arrage
            const userData = {
                email: "by@gmail.com",
                password: "",
            };

            //---- act
            const response = await request(app)
                .post("/auth/login")
                .send(userData);

            expect(response.statusCode).toBe(400);
        });
    });
});
