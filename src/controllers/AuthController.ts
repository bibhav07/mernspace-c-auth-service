import { Logger } from "winston";
import { JwtPayload } from "jsonwebtoken";
import { RegisterUserRequest } from "../types";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
    ) {
        this.userService = userService;
    }

    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { firstName, lastName, email, password } = req.body;

        this.logger.debug("New incomming data for register", {
            firstName,
            lastName,
            email,
            password: "****",
        });
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            });

            this.logger.info(`New user registered -> id ${user.id}`);

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            //saving the refresh token
            const newRefreshToken =
                await this.tokenService.presistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            });

            //setting cookie
            res.cookie("accessToken", accessToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60, //1h
                httpOnly: true,
            });

            res.cookie("refreshToken", refreshToken, {
                domain: "localhost",
                sameSite: "strict",
                maxAge: 1000 * 60 * 60 * 24 * 365, //365days | 1y
                httpOnly: true,
            });

            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
