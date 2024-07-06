import { Repository } from "typeorm";
import { User } from "../entity/User";
import { LimitedUserData, userData, UserQueryParams } from "../types";
import createHttpError from "http-errors";
import bcrypt from "bcryptjs";
import { RefreshToken } from "../entity/RefreshToken";
import { AppDataSource } from "../config/data-source";

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({
        firstName,
        lastName,
        email,
        password,
        role,
        tenantId,
    }: userData) {
        const isEmailExists = await this.userRepository.findOne({
            where: { email },
        });
        if (isEmailExists) {
            const err = createHttpError(400, "email already taken");
            throw err;
        }
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                role,
                tenant: tenantId ? { id: tenantId } : undefined,
            });
        } catch (err) {
            const error = createHttpError(500, "unable to store data in DB");
            throw error;
        }
    }

    async findbyEmail(email: string) {
        return await this.userRepository.findOne({ where: { email } });
    }

    async findById(id: number) {
        return await this.userRepository.findOne({
            where: {
                id,
            },
            relations: {
                tenant: true,
            },
        });
    }

    async update(
        userId: number,
        { firstName, lastName, role }: LimitedUserData,
    ) {
        try {
            return await this.userRepository.update(userId, {
                firstName,
                lastName,
                role,
            });
        } catch (err) {
            const error = createHttpError(
                500,
                "Failed to update the user in the database",
            );
            throw error;
        }
    }

    async getAll(validatedQuery: UserQueryParams) {
        const queryBuilder = this.userRepository.createQueryBuilder();

        const result = await queryBuilder
            .skip((validatedQuery.currentPage - 1) * validatedQuery.perPage)
            .take(validatedQuery.perPage)
            .getManyAndCount();

        return result;
        // return await this.userRepository.find();
    }

    async findByEmailWithPassword(email: string) {
        return await this.userRepository.findOne({
            where: {
                email,
            },
            select: [
                "id",
                "firstName",
                "lastName",
                "email",
                "role",
                "password",
            ],
        });
    }

    async deleteById(userId: number) {
        const refreshTokenRepository =
            AppDataSource.getRepository(RefreshToken);
        await refreshTokenRepository
            .createQueryBuilder()
            .delete()
            .from(RefreshToken)
            .where("userId = :userId", { userId })
            .execute();
        return await this.userRepository.delete(userId);
    }
}
