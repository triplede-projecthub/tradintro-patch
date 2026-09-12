import { Wallet } from '../models';
import { UserRepository, VoucherRepository, WalletRepository } from '../repositories';
export declare class WalletService {
    private walletRepository;
    private userRepository;
    private voucherRepository;
    constructor(walletRepository: WalletRepository, userRepository: UserRepository, voucherRepository: VoucherRepository);
    getBalances(userId: number, type?: string): Promise<{
        balance: number;
        total_wallet_trade_value: number;
        last_allocation_amount: number;
        last_allocation_date?: Date;
    }>;
    getWalletSummery(userId: number, type?: string): Promise<{
        trade_money_balance: number;
        trade_money_usable_balance: number;
        last_allocation_amount: number;
        margin_used: number;
        available_margin: number;
        last_allocation_date?: Date;
    }>;
    getStockCountsAndMarginAmount(transactionType: number, userId: number): Promise<{
        qty: number;
        marginAmount: number;
    }>;
    fetchHistory(userId: number, limit: number, offset: number, type?: string, startDate?: string, endDate?: string, search?: string): Promise<Wallet[]>;
    redeemVoucher(userId: number, code: string): Promise<import("../models").Voucher & import("../models").VoucherRelations>;
    _convertUTCDateToLocalDate(date: Date): Date;
    validateVoucher(userId: number, code: string): Promise<import("../models").Voucher & import("../models").VoucherRelations>;
}
