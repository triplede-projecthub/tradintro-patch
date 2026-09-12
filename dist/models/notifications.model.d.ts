import { Entity } from '@loopback/repository';
import { Market } from './market.model';
export declare class Notifications extends Entity {
    notification_id?: number;
    notification_news_id?: number;
    notification_user_id: number;
    notification_user_type?: string;
    notification_price?: number;
    notification_heading?: string;
    notification_text?: string;
    notification_stock_id?: number;
    notification_type: number;
    notification_start_date: Date;
    notification_execute_date: Date;
    notification_shedule_date: Date;
    notification_status: number;
    alert_popup_status?: number;
    firebase_send_status?: number;
    market: Market;
    constructor(data?: Partial<Notifications>);
}
export interface NotificationsRelations {
}
export declare type NotificationsWithRelations = Notifications & NotificationsRelations;
