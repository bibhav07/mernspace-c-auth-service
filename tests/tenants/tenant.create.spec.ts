import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { Tenants } from "../../src/entity/Tenants";
import createJWKSMock from "mock-jwks";
import { Roles } from "../../src/constants";

describe.skip("POST /tenants", () => {
    let connection: DataSource;
    let jwks: ReturnType<typeof createJWKSMock>;
    let adminToken: string;

    beforeAll(async () => {
        jwks = createJWKSMock("http://localhost:5501");
        connection = await AppDataSource.initialize();
    });

    beforeEach(async () => {
        jwks.start();
        await connection.dropDatabase();
        await connection.synchronize();
        adminToken = jwks.token({
            sub: "1",
            role: Roles.ADMIN,
        });
    });

    afterAll(async () => {
        // await connection.destroy();
    });

    afterEach(async () => {
        jwks.stop();
    });

    describe("Given all fields", () => {
        it("should return 201", async () => {
            const tenantData = {
                name: "Tenant name",
                address: "Tenant address",
            };
            const response = await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(tenantData);

            expect(response.statusCode).toBe(201);
        });

        it("should store a tenant in the database", async () => {
            const tenantData = {
                name: "Tenant name",
                address: "Tenant address",
            };
            await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${adminToken}`])
                .send(tenantData);

            const tenantRepo = connection.getRepository(Tenants);
            const tenants = await tenantRepo.find();

            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        });
        it("should return 401 if user is not authenticated", async () => {
            const tenantData = {
                name: "Tenant name",
                address: "Tenant address",
            };
            const response = await request(app)
                .post("/tenants")
                .send(tenantData);

            const tenantRepo = connection.getRepository(Tenants);
            const tenants = await tenantRepo.find();

            expect(response.statusCode).toBe(401);
            expect(tenants).toHaveLength(0);
        });
        it("should return 403 if user is not a admin", async () => {
            const managerToken = jwks.token({
                sub: "1",
                role: Roles.MANAGER,
            });
            const tenantData = {
                name: "Tenant name",
                address: "Tenant address",
            };
            const response = await request(app)
                .post("/tenants")
                .set("Cookie", [`accessToken=${managerToken}`])
                .send(tenantData);

            const tenantRepo = connection.getRepository(Tenants);
            const tenants = await tenantRepo.find();

            expect(response.statusCode).toBe(403);
            expect(tenants).toHaveLength(0);
        });
    });
});
