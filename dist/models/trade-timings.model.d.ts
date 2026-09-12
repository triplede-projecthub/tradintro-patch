import { Entity } from '@loopback/repository';
export declare class TradeTimings extends Entity {
    time_id?: number;
    time_open: string;
    time_close: string;
    time_day: string;
    day_status?: number;
    constructor(data?: Partial<TradeTimings>);
}
export interface TradTimingsRelations {
}
export declare type TradTimingsWithRelations = TradeTimings & TradTimingsRelations;
