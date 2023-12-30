import { Request } from "express";

export interface userData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface RegisterUserRequest extends Request {
    body: userData;
}
export interface userLoginData {
    email: string;
    password: string;
}

export interface LoginUserRequest extends Request {
    body: userLoginData;
}

export interface AuthRequest extends Request {
    auth: {
        sub: string;
        role: string;
    };
}
