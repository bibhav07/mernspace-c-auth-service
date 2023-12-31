import { Logger } from "winston";
import { JwtPayload } from "jsonwebtoken";
import { AuthRequest, LoginUserRequest, RegisterUserRequest } from "../types";
import { NextFunction, Response } from "express";
import { validationResult } from "express-validator";
import { UserService } from "../services/UserService";
import { TokenService } from "../services/TokenService";
import createHttpError from "http-errors";
import { CredetialService } from "../services/CredentialService";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credetialService: CredetialService,
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
            const newRefreshTokenUserId =
                await this.tokenService.presistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshTokenUserId.id),
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
    async login(req: LoginUserRequest, res: Response, next: NextFunction) {
        const result = validationResult(req);
        if (!result.isEmpty()) {
            return res.status(400).json({ errors: result.array() });
        }

        const { email, password } = req.body;

        this.logger.debug("New incomming data for register", {
            email,
            password: "****",
        });

        try {
            //find the user by email
            const user = await this.userService.findbyEmail(email);

            if (!user) {
                const error = createHttpError(
                    400,
                    "Email or password did not match",
                );
                return next(error);
            }

            //match password of found user by email;
            const matchPassword = await this.credetialService.comparePassword(
                password,
                user.password,
            );
            if (!matchPassword) {
                const error = createHttpError(
                    400,
                    "Email or password did not match",
                );
                return next(error);
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            };

            const accessToken = this.tokenService.generateAccessToken(payload);

            //saving the refresh token - generated for user 
            const newRefreshTokenUserId =
                await this.tokenService.presistRefreshToken(user);

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshTokenUserId.id),
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

            this.logger.info("user logged in", { id: user.id });
            res.status(200).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }

    async self(req: AuthRequest, res: Response) {
        // const user = await this.userService.findById(Number(req.auth.sub));
        const user = await this.userService.findById(Number(req.auth.sub));
        return res.status(200).json({...user, password:undefined});
    }
}
