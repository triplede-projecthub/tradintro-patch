import { Entity } from '@loopback/repository';
import { Indices } from './indices.model';
import { MarketHistory } from './market-history.model';
import { Notifications } from './notifications.model';
import { PortfolioItem } from './portfolio-item.model';
import { StockInfo } from './stock-info.model';
import { WatchList } from './watch-list.model';
export declare class Market extends Entity {
    stock_id?: number;
    stock_code: string;
    stock_name: string;
    stock_api_code: string;
    stock_type?: number;
    stock_margin?: number;
    stock_indices_id?: number;
    status?: number;
    history?: MarketHistory[];
    watchlist: WatchList;
    stockInfo: StockInfo;
    indices: Indices;
    portfolioItems: PortfolioItem[];
    alert: Notifications;
    constructor(data?: Partial<Market>);
}
export interface MarketListRelations {
}
export declare type MarketListWithRelations = Market & MarketListRelations;
