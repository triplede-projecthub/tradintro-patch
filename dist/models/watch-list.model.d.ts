import { Entity } from '@loopback/repository';
import { Market } from './market.model';
import { Notifications } from './notifications.model';
export declare class WatchList extends Entity {
    watchlist_id?: number;
    watchlist_stock_id: number;
    watchlist_user_id: number;
    watchlist_stock_price: number;
    watchlist_date?: Date;
    market: Market;
    alert: Notifications;
    constructor(data?: Partial<WatchList>);
}
export interface WatchListRelations {
}
export declare type WatchListWithRelations = WatchList & WatchListRelations;
