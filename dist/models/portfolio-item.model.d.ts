import { Entity } from '@loopback/repository';
import { Market } from './market.model';
import { Notifications } from './notifications.model';
export declare class PortfolioItem extends Entity {
    order_id?: number;
    order_stock_id: number;
    order_user_id: number;
    order_no: string;
    order_price: number;
    total_stock_value: number;
    brokerage?: number;
    transaction_charge?: number;
    order_total: number;
    margin_amount_used: number;
    margin_status: number;
    order_qty: number;
    order_createdon?: Date;
    order_executed_on?: Date;
    order_type: number;
    order_execution_type?: number;
    order_status?: number;
    market_status?: number;
    portfolio_status?: number;
    order_validity?: number;
    order_validity_date?: Date;
    order_email_status?: number;
    transactions?: PortfolioItem[];
    isEditEnabled?: boolean;
    isPriceEditEnabled?: boolean;
    market: Market;
    alert: Notifications;
    constructor(data?: Partial<PortfolioItem>);
}
export interface OrderListRelations {
}
export declare type OrderListWithRelations = PortfolioItem & OrderListRelations;
