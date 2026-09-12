import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { TradeTimings, TradTimingsRelations } from '../models';
export declare class TradeTimingsRepository extends DefaultCrudRepository<TradeTimings, typeof TradeTimings.prototype.time_id, TradTimingsRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
