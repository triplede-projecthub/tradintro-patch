import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { Tax, TaxRelations } from '../models/tax.model';
export declare class TaxRepository extends DefaultCrudRepository<Tax, typeof Tax.prototype.tax_id, TaxRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
