import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import createJWKSMock from "mock-jwks";

describe.skip("GET /auth/self", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
    });

    afterAll(async () => {
        jwks.stop();
        // await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should return the 200 status code", async () => {
            //generate token
            const accessToken = jwks.token({ sub: "1", role: Roles.CUSTOMER });
            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();
            expect(response.statusCode).toBe(200);
        });
        it("should return user data", async () => {
            //register user
            const userData = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret",
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            //generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            //add token to cookie

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();

            //assert
            expect((response.body as Record<string, string>).id).toBe(data.id);
        });
        it("should not return user password", async () => {
            //register user
            const userData = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret",
            };
            const userRepository = connection.getRepository(User);
            const data = await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            //generate token
            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            });

            //add token to cookie

            const response = await request(app)
                .get("/auth/self")
                .set("Cookie", [`accessToken=${accessToken}`])
                .send();

            //assert
            expect(response.body as Record<string, string>).not.toHaveProperty(
                "password",
            );
        });
        it("should return 401 is token not provided", async () => {
            //register user
            const userData = {
                firstName: "Bibhav",
                lastName: "Y",
                email: "by@gmail.com",
                password: "secret",
            };
            const userRepository = connection.getRepository(User);
            await userRepository.save({
                ...userData,
                role: Roles.CUSTOMER,
            });

            const response = await request(app).get("/auth/self").send();

            //assert
            expect(response.statusCode).toBe(401);
        });
    });
});
