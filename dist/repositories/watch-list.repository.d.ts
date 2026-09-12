import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { Market, Notifications, WatchList, WatchListRelations } from '../models';
import { MarketRepository } from './market.repository';
import { NotificationsRepository } from './notifications.repository';
export declare class WatchListRepository extends DefaultCrudRepository<WatchList, typeof WatchList.prototype.watchlist_id, WatchListRelations> {
    protected marketRepositoryGetter: Getter<MarketRepository>;
    protected notificationsRepositoryGetter: Getter<NotificationsRepository>;
    readonly market: HasOneRepositoryFactory<Market, typeof WatchList.prototype.watchlist_stock_id>;
    readonly alert: HasOneRepositoryFactory<Notifications, typeof WatchList.prototype.watchlist_stock_id>;
    constructor(dataSource: TradIntroMySqlDataSource, marketRepositoryGetter: Getter<MarketRepository>, notificationsRepositoryGetter: Getter<NotificationsRepository>);
}
