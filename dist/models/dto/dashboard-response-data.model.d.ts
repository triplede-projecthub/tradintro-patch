import { Model } from '@loopback/repository';
export declare class DashboardResponseData extends Model {
    current_points?: number;
    last_login?: string;
    user_level?: number;
    level_badge_image?: string;
    user_name?: string;
    user_id: number;
    constructor(data?: Partial<DashboardResponseData>);
}
export interface DashboardResponseDataRelations {
}
export declare type DashboardResponseDataWithRelations = DashboardResponseData & DashboardResponseDataRelations;
