import express, { NextFunction, Response } from "express";
import { TenantController } from "../controllers/TenantController";
import { TenantService } from "../services/TenantService";
import { Tenants } from "../entity/Tenants";
import { AppDataSource } from "../config/data-source";
import logger from "../config/logges";
import { CreateTenantRequest } from "./../types/index";
import authenticate from "../middlewares/authenticate";
import { Roles } from "../constants";
import { canAccess } from "../middlewares/canAccess";
import tenantValidator from "../validators/tenant-validator";

const router = express.Router();

const tenantRepository = AppDataSource.getRepository(Tenants);
const tenantService = new TenantService(tenantRepository);
const tenantController = new TenantController(tenantService, logger);

router.get("/", (req, res, next) => tenantController.getAll(req, res, next));

router.get("/:id", authenticate, (req, res, next) =>
    tenantController.getOne(req, res, next),
);

router.post(
    "/",
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next),
);

router.patch(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next),
);

router.delete(
    "/:id",
    authenticate,
    canAccess([Roles.ADMIN]),
    (req, res, next) => tenantController.destroy(req, res, next),
);

export default router;