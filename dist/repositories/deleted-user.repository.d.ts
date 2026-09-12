import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { DeletedUsers, DeletedUsersRelations } from '../models/deleted_user.model';
export declare class DeletedUserRepository extends DefaultCrudRepository<DeletedUsers, typeof DeletedUsers.prototype.id, DeletedUsersRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
