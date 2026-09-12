import { Count } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
import { Notifications, PortfolioItem, ProfitLossSummery } from '../models';
import { ApiResponse } from '../models/dto/api-response-base.model';
import { PortfolioDashboardResponse } from '../models/dto/portfolio-dashboard-response.model';
import { PortfolioStockDashboardResponse } from '../models/dto/portfolio-stock-dashboard-response.model';
import { StockTransaction } from '../models/dto/stock-transaction.model';
import { PortfolioService, ProfileUserService, WalletService } from '../services';
export declare class PortfolioController {
    private portfolioService;
    private user;
    private userService;
    private walletService;
    constructor(portfolioService: PortfolioService, user: UserProfile, userService: ProfileUserService, walletService: WalletService);
    count(order_execution_type?: string, order_status?: number, portfolio_status?: number): Promise<ApiResponse<Count>>;
    getPortfolios(startDate: string, endDate: string, search: string, limit?: number, offset?: number, order_execution_type?: string, order_status?: string, portfolio_status?: string, market_status?: string): Promise<ApiResponse<PortfolioItem[]>>;
    getPortfoliosPending(orderType: string | undefined, stockId: string): Promise<ApiResponse<PortfolioItem[]>>;
    getPortfoliosV2(search: string, limit?: number, stockId?: string, offset?: number, order_execution_type?: string, order_status?: string, portfolio_status?: string, market_status?: string, margin_status?: string): Promise<ApiResponse<PortfolioItem[]>>;
    getHistoricalOrdersReport(limit?: number, offset?: number, search?: string, startDate?: string, endDate?: string): Promise<ApiResponse<PortfolioItem[]>>;
    getCurrentOrdersReport(orderType: string, limit?: number, offset?: number, marginStatus?: string, search?: string, startDate?: string, endDate?: string): Promise<ApiResponse<PortfolioItem[]>>;
    getProfitLossSummery(): Promise<ApiResponse<ProfitLossSummery>>;
    getPortfolioDashboard(): Promise<ApiResponse<PortfolioDashboardResponse>>;
    getPortfolioDashboardV2(marginStatus?: string): Promise<ApiResponse<PortfolioDashboardResponse>>;
    private limitDecimalPoints;
    private roundNumberV1;
    getPortfolioDashboardForStock(stockId: number, marginStatus?: string): Promise<ApiResponse<PortfolioStockDashboardResponse>>;
    findById(id: number): Promise<ApiResponse<PortfolioItem>>;
    getPortfolioTransactions(stockId: number, orderStatus?: string, portfolioStatus?: string): Promise<ApiResponse<PortfolioItem[]>>;
    setPortfolioAlert(id: number, alertRequest: {
        amount: number;
    }): Promise<ApiResponse<Notifications>>;
    removePortfolioAlert(alertId: number): Promise<ApiResponse<Count>>;
    deleteUserAccount(id: number): Promise<ApiResponse<Count>>;
    buyStock(id: number, stockTransaction: StockTransaction): Promise<ApiResponse<PortfolioItem>>;
    sellStock(id: number, stockTransaction: StockTransaction): Promise<ApiResponse<PortfolioItem>>;
    sellStockUpdate(orderId: number, stockTransaction: StockTransaction): Promise<ApiResponse<PortfolioItem>>;
    buyStockUpdate(orderId: number, stockTransaction: StockTransaction): Promise<ApiResponse<PortfolioItem>>;
    stockRequestCancel(orderId: number): Promise<ApiResponse<PortfolioItem>>;
}
