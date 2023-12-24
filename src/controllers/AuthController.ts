import fs from "fs"; 
import path from "path";
import { NextFunction, Response } from "express";
import { RegisterUserRequest } from "../types";
import { UserService } from "../services/UserService";
import { Logger } from "winston";
import { validationResult } from "express-validator";
import {JwtPayload, sign} from "jsonwebtoken";
import createHttpError from "http-errors";

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
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
           
           
           let privateKey: Buffer;

            try {
                privateKey = fs.readFileSync(path.join(__dirname, '../../certs/private.pem'));
            } catch (err) {
                 const error = createHttpError(500, "Error while reading private key");
                 return next(error); 
            }
            //attach cookies

           const payload: JwtPayload = {
            sub: String(user.id),
            role: user.role
           };

            const accessToken = sign(payload, privateKey, {
                algorithm: "RS256",
                expiresIn: "1h",
                issuer: "auth-service"
            })

            const refreshToken = 'LMNO';

            res.cookie('accessToken', accessToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60, //1h
                httpOnly: true
            });
            res.cookie('refreshToken', refreshToken, {
                domain: 'localhost',
                sameSite: 'strict',
                maxAge: 1000 * 60 * 60 * 24 * 365, //365days
                httpOnly: true 
            });
            
            res.status(201).json({ id: user.id });
        } catch (error) {
            next(error);
            return;
        }
    }
}
