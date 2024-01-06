import { Logger } from "winston";
import { TenantService } from "../services/TenantService";
import { NextFunction, Response } from "express";
import { CreateTenantRequest } from "../types";

export class TenantController {
    constructor(private tenantService: TenantService, private logger: Logger){}

    async create(req: CreateTenantRequest, res: Response, next: NextFunction ){
        const {name, address} = req.body;
        try {
            const tenant = await this.tenantService.create({name, address});
            this.logger.info("Tenant has been created", { id: tenant.id });

            res.status(201).json({ id: tenant.id });
        } catch (error) {
            next(error);
        }
    }

}