import { Model } from '@loopback/repository';
export declare class PortfolioStockDashboardResponse extends Model {
    portfolioId: string;
    stockId: string;
    stockName: string;
    stockApiCode: string;
    stockCode: string;
    currentPrice: number;
    avgPurchasePrice: number;
    qty: number;
    totalPrice: number;
    totalValue: number;
    alertPrice?: number;
    gainLossValue?: number;
    gainLossPercentage?: number;
    user_id: number;
    constructor(data?: Partial<PortfolioStockDashboardResponse>);
}
export interface PortfolioStockDashboardResponseRelations {
}
export declare type PortfolioStockDashboardResponseWithRelations = PortfolioStockDashboardResponse & PortfolioStockDashboardResponseRelations;
