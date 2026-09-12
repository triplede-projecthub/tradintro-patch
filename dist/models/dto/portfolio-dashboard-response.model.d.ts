import { Model } from '@loopback/repository';
export declare class PortfolioDashboardResponse extends Model {
    holding_value?: number;
    holding_value_diff?: number;
    holding_value_diff_percentage?: number;
    trade_money_balance?: number;
    total_trade_money?: number;
    total_investment?: number;
    user_id: number;
    total_portfolio_qty: number;
    usedMargin: number;
    tradeMoneyUsed: number;
    constructor(data?: Partial<PortfolioDashboardResponse>);
}
export interface PortfolioDashboardResponseRelations {
}
export declare type PortfolioDashboardResponseWithRelations = PortfolioDashboardResponse & PortfolioDashboardResponseRelations;
