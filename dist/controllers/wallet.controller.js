"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const moment_1 = tslib_1.__importDefault(require("moment"));
const wallet_summery_response_model_1 = require("../models/dto/wallet-summery-response.model");
const services_1 = require("../services");
const security_spec_1 = require("../utils/security-spec");
const api_utils_1 = require("./api.utils");
const wallet_dto_1 = require("./dto/wallet.dto");
let WalletController = class WalletController {
    constructor(walletService, user) {
        this.walletService = walletService;
        this.user = user;
    }
    async getWalletSummery(type) {
        return new Promise((resolve, reject) => {
            const walletSummery = new wallet_summery_response_model_1.WalletSummeryResponse({ user_id: +(this.user.id) });
            this.walletService.getWalletSummery(+(this.user.id), type).then((summery) => {
                walletSummery.trade_money_balance = this.limitDecimalPoints(summery.trade_money_balance);
                walletSummery.last_allocation_amount = summery.last_allocation_amount;
                walletSummery.trade_money_usable_balance = this.limitDecimalPoints(summery.trade_money_usable_balance);
                walletSummery.margin_used = summery.margin_used;
                walletSummery.available_margin = this.limitDecimalPoints(summery.available_margin);
                walletSummery.trade_money_blocked = this.limitDecimalPoints(summery.trade_money_blocked);
                if (summery.last_allocation_date) {
                    console.log(summery.last_allocation_date);
                    walletSummery.last_allocated_on = (0, moment_1.default)(summery.last_allocation_date).utc().format("DD/MM/YYYY hh:mm A");
                }
                resolve((0, api_utils_1.generateApiResponse)({
                    data: walletSummery,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => { reject(error); });
        });
    }
    limitDecimalPoints(amount) {
        //return Math.trunc(amount * Math.pow(10, 2)) / Math.pow(10, 2);
        return this.roundNumberV1(+amount.toFixed(3), 2);
    }
    roundNumberV1(num, scale) {
        if (!("" + num).includes("e")) {
            return +(Math.round(+(num + "e+" + scale)) + "e-" + scale);
        }
        else {
            const arr = ("" + num).split("e");
            let sig = "";
            if (+arr[1] + scale > 0) {
                sig = "+";
            }
            const i = +arr[0] + "e" + sig + (+arr[1] + scale);
            const j = Math.round(+i);
            const k = +(j + "e-" + scale);
            return k;
        }
    }
    async findHistory(search, startDate, endDate, type, limit = 10, offset = 0) {
        return new Promise((resolve, reject) => {
            this.walletService.fetchHistory(+(this.user.id), limit, offset, type, startDate, endDate, search).then((history) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: history,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((err) => { reject(err); });
        });
    }
    async redeemVoucher(voucherRequest) {
        return new Promise((resolve, reject) => {
            this.walletService
                .redeemVoucher(+(this.user.id), voucherRequest.code)
                .then((voucher) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: voucher,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((err) => { reject(err); });
        });
    }
    async validateVoucher(voucherRequest) {
        return new Promise((resolve, reject) => {
            this.walletService
                .validateVoucher(+(this.user.id), voucherRequest.code)
                .then((voucher) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: voucher,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((err) => { reject(err); });
        });
    }
};
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/wallet/summery', {
        description: 'Wallet summery of user.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': wallet_dto_1.WALLET_SUMMERY_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('type', {
        optional: true,
        description: 'pass `voucher` or `recharge` for filtering purposes.\
      ignore to get balance of all.'
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "getWalletSummery", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/wallet/history', {
        description: 'Wallet recharge history of user.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': wallet_dto_1.WALLET_HISTORY_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('search', { optional: true })),
    tslib_1.__param(1, rest_1.param.query.string('startDate', { optional: true })),
    tslib_1.__param(2, rest_1.param.query.string('endDate', { optional: true })),
    tslib_1.__param(3, rest_1.param.query.string('type', {
        optional: true,
        description: 'pass `voucher` or `recharge` for filtering purposes.\
      ignore to get balance of all.'
    })),
    tslib_1.__param(4, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(5, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "findHistory", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/voucher/redeem', {
        description: 'Voucher redeem.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': wallet_dto_1.VOUCHER_RESPONSE,
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    title: 'VoucherRequest',
                    properties: {
                        code: { type: 'string' },
                    }
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "redeemVoucher", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/voucher/validate', {
        description: 'Voucher validate.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': wallet_dto_1.VOUCHER_RESPONSE,
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    title: 'VoucherRequest',
                    properties: {
                        code: { type: 'string' },
                    }
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WalletController.prototype, "validateVoucher", null);
WalletController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(services_1.WalletService)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [services_1.WalletService, Object])
], WalletController);
exports.WalletController = WalletController;
//# sourceMappingURL=wallet.controller.js.map