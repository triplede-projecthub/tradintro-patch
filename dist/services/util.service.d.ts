import { Market } from '../models';
import { MarketHistoryRepository } from '../repositories';
export declare class UtilService {
    private marketHistoryRepository;
    constructor(marketHistoryRepository: MarketHistoryRepository);
    handleMarketHistory(market: Market): Promise<void>;
    private getLatestPriceHistory;
    private dateApiFormattedDate;
}
