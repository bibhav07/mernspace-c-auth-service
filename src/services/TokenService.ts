import { JwtPayload, sign } from "jsonwebtoken";
import createHttpError from "http-errors";
import { Config } from "../config";
import { User } from "../entity/User";
import { Repository } from "typeorm";
import { RefreshToken } from "../entity/RefreshToken";

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: string;
        if(!Config.PRIVATE_KEY){
            const error = createHttpError(
                500,
                "Secret key is not set",
            );
            throw error;
        }
        try {
            privateKey = Config.PRIVATE_KEY!
        } catch (err) {
            const error = createHttpError(
                500,
                "Error while reading private key",
            );
            throw error;
        }

        //generating token
        const accessToken = sign(payload, privateKey, {
            algorithm: "RS256",
            expiresIn: "1h",
            issuer: "auth-service",
        });

        return accessToken;
    }

    generateRefreshToken(payload: JwtPayload) {
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: "HS256",
            expiresIn: "1y",
            issuer: "auth-service",
            jwtid: String(payload.id),
        });
        return refreshToken;
    }

    async presistRefreshToken(user: User) {
        //save reresh token to db
        const MS_IN_YEAR = 1000 * 60 * 60 * 24 * 365; //1y
        //saving the refresh token
        const newRefreshToken = await this.refreshTokenRepository.save({
            user,
            expiresAt: new Date(Date.now() + MS_IN_YEAR),
        });
        return newRefreshToken;
    }

    async deleteRefreshToken(tokenId: number) {
        return this.refreshTokenRepository.delete({ id: tokenId });
    }
}
