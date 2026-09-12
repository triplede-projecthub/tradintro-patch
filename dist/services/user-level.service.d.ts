import { UserPoints } from '../models';
import { UserLevelsResponse } from '../models/dto/user-levels-response.model';
import { UserLevelPointsRepository, UserPointsRepository, UserRepository } from '../repositories';
import { UserPointsService } from './user-points.service';
export declare class UserLevelService {
    userPointsService: UserPointsService;
    private userRepository;
    private userPointsRepository;
    private userLevelPointsRepository;
    constructor(userPointsService: UserPointsService, userRepository: UserRepository, userPointsRepository: UserPointsRepository, userLevelPointsRepository: UserLevelPointsRepository);
    getUserLevels(userId: number): Promise<UserLevelsResponse>;
    getUserPointsHistory(userId: number, limit: number, offset: number): Promise<UserPoints[]>;
}
