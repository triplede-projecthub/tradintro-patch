import { Count, FilterExcludingWhere, Where } from '@loopback/repository';
import { Market, MarketListRelations } from '../models/market.model';
import { MarketHistoryRepository, MarketRepository, NotificationsRepository } from '../repositories';
import { UtilService } from './util.service';
export declare class MarketService {
    private marketListRepository;
    private notificationsRepository;
    private marketHistoryRepository;
    private utilService;
    constructor(marketListRepository: MarketRepository, notificationsRepository: NotificationsRepository, marketHistoryRepository: MarketHistoryRepository, utilService: UtilService);
    getMarketDateOfStock(stockCode: string): Promise<unknown>;
    getStockNews(userId: number, stockId: number, notification_type: string, search: string | undefined, limit: number, offset: number, stockNews: boolean): Promise<any>;
    count(where: Where<Market> | undefined): Promise<Count>;
    find(userId: number, limit: number, offset: number, stock_type: string, stock_status: string, stock_indices_id: string, search?: string): Promise<(Market & MarketListRelations)[]>;
    findById(id: number, filter: FilterExcludingWhere<Market> | undefined): Promise<Market>;
    findTransactionForMarketById(id: number, userId: number, orderStatus: string, portfolioStatus: string, marketStatus: string): Promise<Market>;
    findSimilarStocks(userId: number, stockId: number, limit: number): Promise<(Market & MarketListRelations)[] | undefined>;
    private _findBetterStocksInSimilarSector;
    private _findAnyStocksInSimilarSector;
    private _findAnyStocksWithByPerformance;
}
