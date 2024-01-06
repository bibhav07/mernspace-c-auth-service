import { Repository } from "typeorm";
import { ITenant } from "../types";
import { Tenants } from "../entity/Tenants";

export class TenantService {
    constructor(private tenantRepository: Repository<Tenants>) {}

    async create(tenantData: ITenant) {
        return await this.tenantRepository.save(tenantData);
    }

    async update(id: number, tenantData: ITenant) {
        return await this.tenantRepository.update(id, tenantData);
    }

    async getAll() {
        return await this.tenantRepository.find();
    }

    async getById(tenantId: number) {
        return await this.tenantRepository.findOne({ where: { id: tenantId } });
    }

    async deleteById(tenantId: number) {
        return await this.tenantRepository.delete(tenantId);
    }
}
