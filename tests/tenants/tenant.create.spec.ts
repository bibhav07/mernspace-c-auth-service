import request from "supertest";
import { AppDataSource } from "../../src/config/data-source";
import { DataSource } from "typeorm";
import app from "../../src/app";
import { Tenants } from "../../src/entity/Tenants";

describe("POST /tenants", () => {
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

    describe("Given all fields",  () => {
         
        it("should return 201", async () => {
            const tenantData  = {
                name: "Tenant name",
                address: "Tenant address"
            }
            const response = await request(app).post("/tenants").send(tenantData);
    
            expect(response.statusCode).toBe(201);
        });
        
        
        
        it("should store a tenant in the database", async () => {
            const tenantData  = {
                name: "Tenant name",
                address: "Tenant address"
            }
            await request(app).post("/tenants").send(tenantData);

            const tenantRepo = connection.getRepository(Tenants);
            const tenants = await tenantRepo.find();

            expect(tenants).toHaveLength(1);
            expect(tenants[0].name).toBe(tenantData.name);
            expect(tenants[0].address).toBe(tenantData.address);
        })
    
    });

   
});
