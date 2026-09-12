import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { UserInvite, UserInviteRelations } from '../models';
export declare class UserInviteRepository extends DefaultCrudRepository<UserInvite, typeof UserInvite.prototype.invite_id, UserInviteRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
