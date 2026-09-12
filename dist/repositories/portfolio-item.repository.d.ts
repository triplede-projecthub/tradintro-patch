import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { OrderListRelations, PortfolioItem, Market, Notifications } from '../models';
import { MarketRepository } from './market.repository';
import { NotificationsRepository } from './notifications.repository';
export declare class PortfolioItemRepository extends DefaultCrudRepository<PortfolioItem, typeof PortfolioItem.prototype.order_id, OrderListRelations> {
    protected marketRepositoryGetter: Getter<MarketRepository>;
    protected notificationsRepositoryGetter: Getter<NotificationsRepository>;
    readonly market: HasOneRepositoryFactory<Market, typeof PortfolioItem.prototype.order_stock_id>;
    readonly alert: HasOneRepositoryFactory<Notifications, typeof PortfolioItem.prototype.order_stock_id>;
    constructor(dataSource: TradIntroMySqlDataSource, marketRepositoryGetter: Getter<MarketRepository>, notificationsRepositoryGetter: Getter<NotificationsRepository>);
}
