import { Entity } from '@loopback/repository';
export declare class UserLevelPoints extends Entity {
    user_level_id?: number;
    user_level_name: string;
    user_level_image: string;
    user_level_points: number;
    user_level_feature: string;
    earn_points: string;
    level_position: number;
    login_point: number;
    max_login_point: number;
    recharge_pts: number;
    max_recharge_pts: number;
    recharge_unit: number;
    pts_per_buy: number;
    max_pts_per_buy: number;
    pts_per_unit_buy_trade_value: number;
    unit_buy_trade_value: number;
    max_pts_buy_trade_value: number;
    pts_per_stock: number;
    max_pts_per_stock: number;
    pts_per_referal: number;
    max_pts_per_referal: number;
    pts_per_watchlist: number;
    max_pts_per_watchlist: number;
    constructor(data?: Partial<UserLevelPoints>);
}
export interface UserLevelPointsRelations {
}
export declare type UserLevelPointsWithRelations = UserLevelPoints & UserLevelPointsRelations;
