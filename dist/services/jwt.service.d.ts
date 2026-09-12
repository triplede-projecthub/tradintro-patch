import { UserProfile } from '@loopback/security';
export declare class JWTServiceUtils {
    readonly apiKeySecret: string;
    readonly expiresSecret: string;
    readonly refreshKeySecret: string;
    readonly refreshExpiresSecret: string;
    generateToken(userProfile: UserProfile): Promise<string>;
    generateRefreshToken(userProfile: UserProfile): Promise<string>;
    getOption(ignoreExp: Boolean): {
        expiresIn: string;
    } | {
        expiresIn?: undefined;
    };
    verifyToken(token: string): Promise<UserProfile>;
    parseJwt(token: string): any;
    verifyRefreshToken(token: string): Promise<UserProfile>;
    createTokenProfile(info: {
        id: string;
        moduleId: string;
        clientId: string;
        channel?: string;
    }): UserProfile;
}
