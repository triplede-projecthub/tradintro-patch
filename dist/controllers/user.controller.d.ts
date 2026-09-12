/// <reference types="express" />
import { Count } from '@loopback/repository';
import { Request } from '@loopback/rest';
import { UserProfile } from '@loopback/security';
import { User, UserInvite } from '../models';
import { ApiResponse } from '../models/dto/api-response-base.model';
import { ChangePasswordRequest } from '../models/dto/change-password-request.model';
import { DashboardResponseData } from '../models/dto/dashboard-response-data.model';
import { FcmTokenChangeRequest } from '../models/dto/fcm-token-change-request.model';
import { LoginResponseData } from '../models/dto/login-response-data.model';
import { UserLogin } from '../models/dto/user-login.model';
import { Tax } from '../models/tax.model';
import { ProfileUserService } from '../services';
export declare class UserController {
    private userService;
    private user;
    constructor(userService: ProfileUserService, user: UserProfile);
    updateBasicUserInfo(request: Request): Promise<ApiResponse<User>>;
    deleteUserAccount(): Promise<ApiResponse<Count>>;
    findById(): Promise<ApiResponse<User>>;
    userLogin(login: UserLogin): Promise<ApiResponse<LoginResponseData>>;
    userLoginPasswordChange(changePasswordRequest: ChangePasswordRequest): Promise<ApiResponse<LoginResponseData>>;
    findUserInviteList(limit?: number, offset?: number): Promise<ApiResponse<UserInvite[]>>;
    userDashBoard(): Promise<ApiResponse<DashboardResponseData>>;
    userFcmTokenChange(fcmTokenChangeRequest: FcmTokenChangeRequest): Promise<ApiResponse<void>>;
    userLogout(fcmTokenChangeRequest: FcmTokenChangeRequest): Promise<ApiResponse<void>>;
    getTaxDetails(): Promise<ApiResponse<Tax[]>>;
}
