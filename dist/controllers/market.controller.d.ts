import { Count, Where } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
import { Market } from '../models';
import { ApiResponse } from '../models/dto/api-response-base.model';
import { MarketService, PortfolioService } from '../services';
export declare class MarketController {
    private marketService;
    private portfolioService;
    private user;
    constructor(marketService: MarketService, portfolioService: PortfolioService, user: UserProfile);
    count(where?: Where<Market>): Promise<ApiResponse<Count>>;
    find(search?: string, stock_type?: string, stock_status?: string, stock_indices_id?: string, limit?: number, offset?: number): Promise<ApiResponse<Market[]>>;
    findById(id: number, appendPending?: boolean): Promise<ApiResponse<Market>>;
    findTransactionForMarketById(id: number, orderStatus?: string, portfolioStatus?: string, marketStatus?: string): Promise<ApiResponse<Market>>;
    findSimilarStocks(stockId: number, limit?: number): Promise<ApiResponse<Market[]>>;
    getNewsOfStock(stockId: number, notification_type?: string, search?: string, limit?: number, offset?: number, stockNews?: boolean): Promise<ApiResponse<Market[]>>;
    getMarketDateOfStock(stockCode: string): Promise<unknown>;
}
