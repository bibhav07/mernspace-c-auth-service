import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";
import { Roles } from "../../src/constants";
import createJWKSMock from "mock-jwks";
import { createTenant } from "../utils";
import { Tenants } from "../../src/entity/Tenants";

describe("GET /user", () => {
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
        await connection.destroy();
    });

    describe("Given all fields", () => {
        it("should persist the user in the db", async () => {
            // Create tenant first
            const tenant = await createTenant(
                connection.getRepository(Tenants),
            );

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.ADMIN,
            });

            // Register user
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "password",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };

            // Add token to cookie
            await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(1);
            expect(users[0].email).toBe(userData.email);
        });

        it("should return 403 if non admin user tries to create user", async () => {
            // Create tenant first
            const tenant = await createTenant(
                connection.getRepository(Tenants),
            );

            const adminToken = jwks.token({
                sub: "1",
                role: Roles.CUSTOMER,
            });

            // Register user
            const userData = {
                firstName: "Rakesh",
                lastName: "K",
                email: "rakesh@mern.space",
                password: "password",
                tenantId: tenant.id,
                role: Roles.MANAGER,
            };

            // Add token to cookie
            const response = await request(app)
                .post("/users")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(userData);

            const userRepository = connection.getRepository(User);
            const users = await userRepository.find();

            expect(users).toHaveLength(0);
            expect(response.statusCode).toBe(403);
        });
    });
});
