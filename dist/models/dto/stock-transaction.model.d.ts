import { Model } from '@loopback/repository';
export declare class StockTransaction extends Model {
    order_qty: number;
    order_execution_type: number;
    stock_code: string;
    order_validity?: number;
    product_type?: number;
    alert_price?: number;
    order_validity_date?: Date;
    [prop: string]: any;
    constructor(data?: Partial<StockTransaction>);
}
export interface StockTransactionRelations {
}
export declare type StockTransactionWithRelations = StockTransaction & StockTransactionRelations;
