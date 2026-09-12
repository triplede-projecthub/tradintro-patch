import { UserProfile } from '@loopback/security';
import { Voucher, Wallet } from '../models';
import { ApiResponse } from '../models/dto/api-response-base.model';
import { WalletSummeryResponse } from '../models/dto/wallet-summery-response.model';
import { WalletService } from '../services';
export declare class WalletController {
    private walletService;
    private user;
    constructor(walletService: WalletService, user: UserProfile);
    getWalletSummery(type?: string): Promise<ApiResponse<WalletSummeryResponse>>;
    limitDecimalPoints(amount: number): number;
    private roundNumberV1;
    findHistory(search: string, startDate: string, endDate: string, type?: string, limit?: number, offset?: number): Promise<ApiResponse<Wallet[]>>;
    redeemVoucher(voucherRequest: {
        code: string;
    }): Promise<ApiResponse<Voucher>>;
    validateVoucher(voucherRequest: {
        code: string;
    }): Promise<ApiResponse<Voucher>>;
}
