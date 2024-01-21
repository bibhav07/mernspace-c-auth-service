import { AuthRequest } from "./../types/index";
import createHttpError from "http-errors";
import { NextFunction, Request, Response } from "express";

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest;
        const roleFromToken = _req.auth.role;

        if (!roles.includes(roleFromToken)) {
            const error = createHttpError(403, "Permission not allowed");
            return next(error);
        }
        next();
    };
};
