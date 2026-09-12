import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { UserPoints, UserPointsRelations } from '../models';
export declare class UserPointsRepository extends DefaultCrudRepository<UserPoints, typeof UserPoints.prototype.points_id, UserPointsRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
