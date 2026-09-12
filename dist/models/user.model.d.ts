import { Entity } from '@loopback/repository';
import { UserLevelPoints } from './user-level-points.model';
export declare class User extends Entity {
    user_id?: number;
    user_type: string;
    admin_user_id?: number;
    secondary_admin?: number;
    user_name: string;
    user_last_name?: string;
    user_phone?: string;
    user_image?: string;
    user_email: string;
    user_password: string;
    user_margin: number;
    user_stock_margin: number;
    tree_level: number;
    user_login_time: Date;
    user_logout_time?: Date;
    user_status: number;
    user_created_on?: Date;
    user_type_change_on?: Date;
    verification_code?: string;
    referal_code?: string;
    refered_by_user_id?: number;
    daily_login_status?: number;
    user_login_count?: number;
    previous_tree_level?: number;
    help_popup?: number;
    invite_email_status?: number;
    userLevel: UserLevelPoints;
    constructor(data?: Partial<User>);
}
export interface UserRelations {
}
export declare type UserWithRelations = User & UserRelations;
