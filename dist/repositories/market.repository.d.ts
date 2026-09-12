import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasManyRepositoryFactory, HasOneRepositoryFactory } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { Indices, Market, MarketHistory, MarketListRelations, Notifications, PortfolioItem, StockInfo, WatchList } from '../models';
import { IndicesRepository } from './indices.repository';
import { MarketHistoryRepository } from './market-history.repository';
import { NotificationsRepository } from './notifications.repository';
import { PortfolioItemRepository } from './portfolio-item.repository';
import { StockInfoRepository } from './stock-info.repository';
import { WatchListRepository } from './watch-list.repository';
export declare class MarketRepository extends DefaultCrudRepository<Market, typeof Market.prototype.stock_id, MarketListRelations> {
    protected marketHistoryRepositoryGetter: Getter<MarketHistoryRepository>;
    protected watchListRepositoryGetter: Getter<WatchListRepository>;
    protected portfolioItemRepositoryGetter: Getter<PortfolioItemRepository>;
    protected notificationsRepositoryGetter: Getter<NotificationsRepository>;
    protected stockInfoRepositoryGetter: Getter<StockInfoRepository>;
    protected indicesRepositoryGetter: Getter<IndicesRepository>;
    readonly history: HasManyRepositoryFactory<MarketHistory, typeof Market.prototype.stock_api_code>;
    readonly watchlist: HasOneRepositoryFactory<WatchList, typeof Market.prototype.stock_id>;
    readonly indices: HasOneRepositoryFactory<Indices, typeof Market.prototype.stock_indices_id>;
    readonly stockInfo: HasOneRepositoryFactory<StockInfo, typeof Market.prototype.stock_code>;
    readonly portfolioItems: HasManyRepositoryFactory<PortfolioItem, typeof Market.prototype.stock_id>;
    readonly alert: HasOneRepositoryFactory<Notifications, typeof Market.prototype.stock_id>;
    constructor(dataSource: TradIntroMySqlDataSource, marketHistoryRepositoryGetter: Getter<MarketHistoryRepository>, watchListRepositoryGetter: Getter<WatchListRepository>, portfolioItemRepositoryGetter: Getter<PortfolioItemRepository>, notificationsRepositoryGetter: Getter<NotificationsRepository>, stockInfoRepositoryGetter: Getter<StockInfoRepository>, indicesRepositoryGetter: Getter<IndicesRepository>);
}
