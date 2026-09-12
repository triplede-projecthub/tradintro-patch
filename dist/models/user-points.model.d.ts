import { Entity } from '@loopback/repository';
export declare class UserPoints extends Entity {
    points_id?: number;
    points_user_id: number;
    points_user_level: number;
    points_type: string;
    points_per_unit: number;
    unit: number;
    total_value: number;
    total_points: number;
    points_date: Date;
    constructor(data?: Partial<UserPoints>);
}
export interface UserPointsRelations {
}
export declare type UserPointsWithRelations = UserPoints & UserPointsRelations;
