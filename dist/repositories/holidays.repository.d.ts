import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { Holidays, HolidaysRelations } from '../models';
export declare class HolidaysRepository extends DefaultCrudRepository<Holidays, typeof Holidays.prototype.holiday_id, HolidaysRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
