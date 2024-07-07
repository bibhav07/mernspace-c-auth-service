import { Request } from "express";

export interface userData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: string;
    tenantId?: number;
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
        id?: string;
    };
}

export type AuthCookie = {
    accessToken: string;
    refreshToken: string;
};

export interface IRefreshTokenPayload {
    id: string;
}

export interface ITenant {
    name: string;
    address: string;
}

export interface CreateTenantRequest extends Request {
    body: ITenant;
}

export interface LimitedUserData {
    firstName: string;
    lastName: string;
    role: string;
}

export interface createUserRequest extends Request {
    body: userData;
}

export interface UpdateUserRequest extends Request {
    body: LimitedUserData;
}

export interface UserQueryParams {
    perPage: number;
    currentPage: number;
    q: string;
    role: string;
}
