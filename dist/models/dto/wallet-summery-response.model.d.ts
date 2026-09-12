import { Model } from '@loopback/repository';
export declare class WalletSummeryResponse extends Model {
    user_id?: number;
    trade_money_balance?: number;
    last_allocated_on?: String;
    last_allocation_amount?: number;
    available_margin?: number;
    margin_used?: number;
    trade_money_usable_balance?: number;
    constructor(data?: Partial<WalletSummeryResponse>);
}
export interface WalletSummeryResponseRelations {
}
export declare type WalletSummeryResponseWithRelations = WalletSummeryResponse & WalletSummeryResponseRelations;
