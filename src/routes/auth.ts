import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logges";
import registerValidator from "../validators/register-validator";
import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
logger;
const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);

//passing dependency instances in auth-conroller
const authcontroller = new AuthController(userService, logger, tokenService);

router.post(
    "/register",
    registerValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authcontroller.register(req, res, next),
);

export default router;
