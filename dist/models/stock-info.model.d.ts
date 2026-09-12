import { Entity } from '@loopback/repository';
export declare class StockInfo extends Entity {
    stock_info_id?: number;
    stock_name_short: string;
    sector?: string;
    about?: string;
    total_income?: string;
    gross_profit?: string;
    profit_before_tax?: string;
    tax?: string;
    profit_after_tax?: string;
    year?: string;
    promoter?: number;
    fii?: number;
    dii?: number;
    public?: number;
    other?: number;
    constructor(data?: Partial<StockInfo>);
}
export interface StockInfoRelations {
}
export declare type StockInfoWithRelations = StockInfo & StockInfoRelations;
