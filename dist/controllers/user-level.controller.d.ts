import { UserProfile } from '@loopback/security';
import { UserPoints } from '../models';
import { ApiResponse } from '../models/dto/api-response-base.model';
import { UserLevelsResponse } from '../models/dto/user-levels-response.model';
import { UserLevelService } from '../services/user-level.service';
export declare class UserLevelController {
    userLevelService: UserLevelService;
    private user;
    constructor(userLevelService: UserLevelService, user: UserProfile);
    getUserLevels(): Promise<ApiResponse<UserLevelsResponse>>;
    getUserLevelsHistory(limit?: number, offset?: number): Promise<ApiResponse<UserPoints[]>>;
}
