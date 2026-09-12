import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { UserToken, UserTokenRelations } from '../models';
export declare class UserTokenRepository extends DefaultCrudRepository<UserToken, typeof UserToken.prototype.token_id, UserTokenRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
