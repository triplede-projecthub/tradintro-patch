import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { UserLevelPoints, UserLevelPointsRelations } from '../models';
export declare class UserLevelPointsRepository extends DefaultCrudRepository<UserLevelPoints, typeof UserLevelPoints.prototype.user_level_id, UserLevelPointsRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
