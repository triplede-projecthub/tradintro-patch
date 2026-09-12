import { Entity } from '@loopback/repository';
export declare class Voucher extends Entity {
    voucher_id?: number;
    voucher_code: string;
    voucher_user_type?: string;
    voucher_amount: number;
    voucher_valid_from: Date;
    voucher_valid_to: Date;
    voucher_type: number;
    voucher_remarks?: string;
    voucher_created_on?: Date;
    constructor(data?: Partial<Voucher>);
}
export interface VoucherRelations {
}
export declare type VoucherWithRelations = Voucher & VoucherRelations;
