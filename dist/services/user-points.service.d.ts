import { UserLevelPoints } from '../models';
import { UserLevelPointsRepository, UserPointsRepository, UserRepository } from '../repositories';
export declare class UserPointsService {
    private userPointsRepository;
    private userLevelPointsRepository;
    private userRepository;
    constructor(userPointsRepository: UserPointsRepository, userLevelPointsRepository: UserLevelPointsRepository, userRepository: UserRepository);
    deleteAllUserPoints(userId: number): Promise<import("@loopback/repository").Count>;
    userLevelPointTotalForType(user_id: number, pointType: string, userLevel: number): Promise<number>;
    createUserLevel(userId: number, type: string): Promise<import("../models").UserPoints>;
    _convertUTCDateToLocalDate(date: Date): Date;
    handleUserPoint(userId: number, type: string, userLevel: number, value?: number): void;
    checkAndUpdateUserLevel(userId: number, userLevel: number): Promise<void>;
    userTotalPoints(user_id: number): Promise<number>;
    findUserLevel(user_points?: number): Promise<UserLevelPoints>;
}
