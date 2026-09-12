import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { Market, Notifications, NotificationsRelations } from '../models';
import { MarketRepository } from './market.repository';
export declare class NotificationsRepository extends DefaultCrudRepository<Notifications, typeof Notifications.prototype.notification_id, NotificationsRelations> {
    protected marketRepositoryGetter: Getter<MarketRepository>;
    readonly market: HasOneRepositoryFactory<Market, typeof Notifications.prototype.notification_stock_id>;
    constructor(dataSource: TradIntroMySqlDataSource, marketRepositoryGetter: Getter<MarketRepository>);
}
