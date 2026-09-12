import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { Wallet, WalletRelations } from '../models';
export declare class WalletRepository extends DefaultCrudRepository<Wallet, typeof Wallet.prototype.wallet_id, WalletRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
