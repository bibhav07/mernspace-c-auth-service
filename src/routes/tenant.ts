import express, { NextFunction, RequestHandler, Response } from "express";
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

router.get(
    "/",
    (req, res, next) =>
        tenantController.getAll(req, res, next) as unknown as RequestHandler,
);

router.get(
    "/:id",
    authenticate as RequestHandler,
    (req, res, next) =>
        tenantController.getOne(req, res, next) as unknown as RequestHandler,
);

router.post(
    "/",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.create(req, res, next) as unknown as RequestHandler,
);

router.patch(
    "/:id",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    tenantValidator,
    (req: CreateTenantRequest, res: Response, next: NextFunction) =>
        tenantController.update(req, res, next) as unknown as RequestHandler,
);

router.delete(
    "/:id",
    authenticate as RequestHandler,
    canAccess([Roles.ADMIN]),
    (req, res, next) =>
        tenantController.destroy(req, res, next) as unknown as RequestHandler,
);

export default router;
