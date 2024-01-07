import express, { NextFunction, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import { Tenants } from "../entity/Tenants";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logges";
import { CreateTenantRequest } from "./../types/index";
import authenticate from "../middlewares/authenticate";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenants);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);
router.post(
    "/",
    authenticate,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);

export default router;
