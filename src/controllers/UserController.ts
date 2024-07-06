import { Logger } from "winston";
import { UserService } from "../services/UserService";
import {
    UpdateUserRequest,
    createUserRequest,
    UserQueryParams,
} from "../types";
import { NextFunction, Request, Response } from "express";
import { matchedData, validationResult } from "express-validator";
import createHttpError from "http-errors";

export class UserController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}

    async create(req: createUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password, tenantId, role } =
            req.body;

        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role,
                tenantId,
            });
            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
        }
    }

    async update(req: UpdateUserRequest, res: Response, next: NextFunction) {
        // In our project: We are not allowing user to change the email id since it is used as username
        // In our project: We are not allowing admin user to change others password

        //validation

        const result = validationResult(req);

        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, role } = req.body;
        const userId = req.params.id;

        if (isNaN(Number(userId)))
            return next(createHttpError(400, "Invalid URL param"));

        this.logger.debug("Request for updating a user", req.body);

        try {
            await this.userService.update(Number(userId), {
                firstName,
                lastName,
                role,
            });
            res.json({ id: Number(userId) });
        } catch (error) {
            next(error);
        }
    }

    async getAll(req: Request, res: Response, next: NextFunction) {
        const validatedQuery = matchedData(req, {
            onlyValidData: true,
        });
        console.log(validatedQuery);

        try {
            const [users, count] = await this.userService.getAll(
                validatedQuery as UserQueryParams,
            );

            res.json({
                currentPage: validatedQuery.currentPage as number,
                perPage: validatedQuery.perPage as number,
                data: users,
                total: count,
            });
        } catch (error) {
            next(error);
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        if (isNaN(Number(userId)))
            return next(createHttpError(400, "Invalid URL param"));
        try {
            const user = await this.userService.findById(Number(userId));
            if (!user)
                return next(createHttpError(400, "User does not exist."));
            res.json(user);
        } catch (error) {
            next(error);
        }
    }

    async destory(req: Request, res: Response, next: NextFunction) {
        const userId = req.params.id;
        if (isNaN(Number(userId)))
            return next(createHttpError(400, "Invalid URL param"));
        try {
            await this.userService.deleteById(Number(userId));
            res.json({ id: Number(userId) });
        } catch (error) {
            next(error);
        }
    }
}
