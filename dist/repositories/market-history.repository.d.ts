import { Getter } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { MarketHistory, MarketHistoryRelations } from '../models';
import { MarketRepository } from './market.repository';
export declare class MarketHistoryRepository extends DefaultCrudRepository<MarketHistory, typeof MarketHistory.prototype.stock_history_id, MarketHistoryRelations> {
    protected marketRepositoryGetter: Getter<MarketRepository>;
    constructor(dataSource: TradIntroMySqlDataSource, marketRepositoryGetter: Getter<MarketRepository>);
}
