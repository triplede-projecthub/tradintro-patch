import { DefaultCrudRepository } from '@loopback/repository';
import { TradIntroMySqlDataSource } from '../datasources';
import { Voucher, VoucherRelations } from '../models';
export declare class VoucherRepository extends DefaultCrudRepository<Voucher, typeof Voucher.prototype.voucher_id, VoucherRelations> {
    constructor(dataSource: TradIntroMySqlDataSource);
}
