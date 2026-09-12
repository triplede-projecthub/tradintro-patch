import { Entity } from '@loopback/repository';
export declare class Wallet extends Entity {
    wallet_id?: number;
    wallet_user_id: number;
    wallet_admin_user_id?: number;
    wallet_member_user_id?: number;
    transaction_type: string;
    payment_order_id?: string;
    wallet_money: number;
    gst?: number;
    other_tax?: number;
    net_amount?: number;
    wallet_trade_value?: number;
    voucher_code_id?: number;
    remarks?: string;
    allocate_email_status?: number;
    wallet_created_on?: Date;
    constructor(data?: Partial<Wallet>);
}
export interface WalletRelations {
}
export declare type WalletWithRelations = Wallet & WalletRelations;
