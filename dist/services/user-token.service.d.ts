import { FcmTokenChangeRequest } from '../models/dto/fcm-token-change-request.model';
import { UserTokenRepository } from '../repositories';
export declare class UserTokenService {
    private userTokenRepository;
    constructor(userTokenRepository: UserTokenRepository);
    deleteAllUserTokens(userId: number): Promise<import("@loopback/repository").Count>;
    updateUserFcmToken(userId: number, fcmTokenChangeRequest: FcmTokenChangeRequest): Promise<boolean>;
    _convertUTCDateToLocalDate(date: Date): Date;
    deleteUserFcmToken(userId: number, fcmTokenChangeRequest: FcmTokenChangeRequest): Promise<boolean>;
}
