import express, { NextFunction, Request, Response } from "express";
import { AuthController } from "../controllers/AuthController";
import { UserService } from "../services/UserService";
import { AppDataSource } from "../config/data-source";
import { User } from "../entity/User";
import logger from "../config/logges";
import registerValidator from "../validators/register-validator";
import loginValidator from "../validators/login-validator";

import { TokenService } from "../services/TokenService";
import { RefreshToken } from "../entity/RefreshToken";
import { CredetialService } from "../services/CredentialService";
import authenticate from "../middlewares/authenticate";
import { AuthRequest } from "../types";
import validateRefreshToken from "../middlewares/validateRefreshToken";
import parseRefreshToken from "../middlewares/parseRefreshToken";

const router = express.Router();

const userRepository = AppDataSource.getRepository(User);
const userService = new UserService(userRepository);

const refreshTokenRepository = AppDataSource.getRepository(RefreshToken);
const tokenService = new TokenService(refreshTokenRepository);

const credetialService = new CredetialService();

//passing dependency instances in auth-conroller
const authcontroller = new AuthController(
    userService,
    logger,
    tokenService,
    credetialService,
);

router.post(
    "/register",
    registerValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authcontroller.register(req, res, next),
);

router.post(
    "/login",
    loginValidator,
    (req: Request, res: Response, next: NextFunction) =>
        authcontroller.login(req, res, next),
);

router.get("/self", authenticate, (req: Request, res: Response) =>
    authcontroller.self(req as AuthRequest, res),
);


router.post("/refresh", validateRefreshToken, (req: Request, res: Response, next: NextFunction) =>
    authcontroller.refresh(req as AuthRequest, res, next),
);


router.post("/logout", authenticate, parseRefreshToken,  (req: Request, res: Response, next: NextFunction) => 
    authcontroller.logout(req as AuthRequest, res, next) 
);




export default router;
