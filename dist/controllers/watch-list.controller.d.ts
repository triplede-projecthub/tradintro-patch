import { Count } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
import { WatchList } from '../models';
import { ApiResponse } from '../models/dto/api-response-base.model';
import { PortfolioService, WatchListService } from '../services';
export declare class WatchListController {
    private watchListService;
    private portfolioService;
    private user;
    constructor(watchListService: WatchListService, portfolioService: PortfolioService, user: UserProfile);
    create(watchList: Omit<WatchList, 'watchlist_user_id' | 'watchlist_id' | 'watchlist_date'>): Promise<ApiResponse<WatchList>>;
    count(): Promise<ApiResponse<Count>>;
    find(search: string, limit?: number, offset?: number): Promise<ApiResponse<WatchList[]>>;
    findById(id: number): Promise<ApiResponse<WatchList>>;
    updateById(id: number, watchList: Omit<WatchList, 'watchlist_user_id' | 'watchlist_stock_id' | 'watchlist_id' | 'watchlist_date'>): Promise<ApiResponse<Count>>;
    deleteById(id: number): Promise<ApiResponse<Count>>;
    setWatchListAlert(id: number, alertRequest: {
        amount: number;
    }): Promise<ApiResponse<Count>>;
    removeWatchListAlert(alertId: number): Promise<ApiResponse<Count>>;
}
