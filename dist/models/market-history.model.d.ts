import { Entity } from '@loopback/repository';
export declare class MarketHistory extends Entity {
    stock_history_id?: number;
    stock_history_code: string;
    stock_history_date: Date;
    stock_history_open: number;
    stock_history_close: number;
    stock_history_high: number;
    stock_history_low: number;
    current_price: number;
    original_date: Date;
    constructor(data?: Partial<MarketHistory>);
}
export interface MarketHistoryRelations {
}
export declare type MarketHistoryWithRelations = MarketHistory & MarketHistoryRelations;
