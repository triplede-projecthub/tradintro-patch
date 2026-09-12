import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { Indices, IndicesRelations } from '../models';
export declare class IndicesRepository extends DefaultCrudRepository<Indices, typeof Indices.prototype.indices_id, IndicesRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
