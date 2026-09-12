import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { StockInfo, StockInfoRelations } from '../models';
export declare class StockInfoRepository extends DefaultCrudRepository<StockInfo, typeof StockInfo.prototype.stock_info_id, StockInfoRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
