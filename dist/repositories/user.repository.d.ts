import { Getter } from '@loopback/core';
import { DefaultCrudRepository, HasOneRepositoryFactory } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { User, UserLevelPoints, UserRelations } from '../models';
import { UserLevelPointsRepository } from './user-level-points.repository';
export declare class UserRepository extends DefaultCrudRepository<User, typeof User.prototype.user_id, UserRelations> {
    protected userLevelPointsRepository: Getter<UserLevelPointsRepository>;
    readonly userLevel: HasOneRepositoryFactory<UserLevelPoints, typeof User.prototype.tree_level>;
    constructor(dataSource: TradIntroMySqlDataSource, userLevelPointsRepository: Getter<UserLevelPointsRepository>);
}
