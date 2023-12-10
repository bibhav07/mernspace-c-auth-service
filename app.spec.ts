import app from "./src/app";
import { calculatediscount } from "./src/config/utils";
import request from "supertest";

describe("App", () => {
    it("should calc the discount", () => {
        const result = calculatediscount(100, 10);
        expect(result).toBe(10);
    });

    it("should return 200 status", async () => {
        //calling the endpoint by initializing the app
        const response = await request(app).get("/").send();
        expect(response.statusCode).toBe(401);
    });
});
