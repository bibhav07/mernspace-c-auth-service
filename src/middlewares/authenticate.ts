import { GetVerificationKey, expressjwt } from "express-jwt";
import JwksClient from "jwks-rsa";
import { Config } from "../config";
import { Request } from "express";
import { AuthCookie } from "../types";

export default expressjwt({
    //getting the public key uri
    secret: JwksClient.expressJwtSecret({
        jwksUri: Config.JWKS_URI!,
        cache: true,
        rateLimit: true,
    }) as GetVerificationKey,
    algorithms: ["RS256"],

    //extracting the token from the incomming request, either from req headers or from cookie and returniing the token
    getToken(req: Request) {
        const authHeader = req.headers.authorization;
        if (authHeader && authHeader.split(" ")[1] !== "undefined") {
            const token = authHeader.split(" ")[1];
            if (token) {
                return token;
            }
        }

        const { accessToken } = req.cookies as AuthCookie;
        return accessToken;
    },
});
