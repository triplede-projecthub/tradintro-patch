"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletService = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/naming-convention */
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const repositories_1 = require("../repositories");
let WalletService = class WalletService {
    constructor(walletRepository, userRepository, voucherRepository) {
        this.walletRepository = walletRepository;
        this.userRepository = userRepository;
        this.voucherRepository = voucherRepository;
    }
    getBalances(userId, type) {
        if (!userId || userId == undefined) {
            throw new rest_1.HttpErrors.BadRequest();
        }
        return new Promise((resolve, reject) => {
            let query = 'select sum(wallet_money) as total_amount,\
      sum(wallet_trade_value) as total_trade_value FROM wallet where \
      wallet_user_id = ' +
                userId;
            if (type) {
                switch (type) {
                    case 'recharge':
                        query += ' and voucher_code_id=0';
                        break;
                    case 'voucher':
                        query += ' and voucher_code_id>0';
                        break;
                    default:
                        reject(new rest_1.HttpErrors.BadRequest());
                }
            }
            this.walletRepository
                .execute(query)
                .then(async (result) => {
                var _a;
                const data = result; //.toString().replace(/RowDataPacket/g, 'RowDataPacket:');
                result = JSON.parse(JSON.stringify(result));
                const last_recharge = await this.walletRepository.findOne({
                    where: {
                        wallet_user_id: userId,
                    },
                    order: ['wallet_created_on DESC'],
                });
                if (result && result.length > 0) {
                    resolve({
                        last_allocation_amount: (_a = last_recharge === null || last_recharge === void 0 ? void 0 : last_recharge.wallet_trade_value) !== null && _a !== void 0 ? _a : 0,
                        last_allocation_date: last_recharge === null || last_recharge === void 0 ? void 0 : last_recharge.wallet_created_on,
                        balance: +result[0].total_amount,
                        total_wallet_trade_value: +result[0].total_trade_value,
                    });
                }
                else {
                    resolve({
                        balance: 0,
                        total_wallet_trade_value: 0,
                        last_allocation_amount: 0,
                    });
                }
            })
                .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
    getWalletSummery(userId, type) {
        if (!userId || userId === undefined) {
            throw new rest_1.HttpErrors.BadRequest();
        }
        return new Promise(async (resolve, reject) => {
            const user = await this.userRepository.findOne({
                where: {
                    user_id: userId,
                    user_status: 1,
                },
            });
            if (!user) {
                throw new rest_1.HttpErrors.BadRequest('Invalid Operation - User Not Found.');
            }
            let totalBuyAmount = 0;
            let totalBuyPendingAmount = 0;
            let totalBuyPendingMarginAmount = 0;
            let totalSellAmount = 0;
            let totalBuyMargin = 0;
            let totalSellMargin = 0;
            let totalBuyResult = await this.walletRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as amount,
        sum(margin_amount_used) as margin_amount
         FROM order_list WHERE order_user_id=${userId} AND order_status=0 AND market_status=0
        AND order_type=0`);
            totalBuyResult = JSON.parse(JSON.stringify(totalBuyResult));
            if (totalBuyResult && totalBuyResult.length > 0) {
                totalBuyAmount =
                    +totalBuyResult[0].amount /* + +totalBuyResult[0].margin_amount */;
                totalBuyMargin = +totalBuyResult[0].margin_amount;
            }
            let totalBuyPendingResult = await this.walletRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as amount,
        sum(margin_amount_used) as margin_amount
         FROM order_list WHERE order_user_id=${userId} AND  ( market_status != 0 OR ( market_status = 0 AND order_status = 1))
        AND order_type=0`);
            totalBuyPendingResult = JSON.parse(JSON.stringify(totalBuyPendingResult));
            if (totalBuyPendingResult && totalBuyPendingResult.length > 0) {
                totalBuyPendingAmount =
                    +totalBuyPendingResult[0].amount /* + +totalBuyPendingResult[0].margin_amount */;
                totalBuyPendingMarginAmount = +totalBuyPendingResult[0].margin_amount;
            }
            let totalSellResult = await this.walletRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as amount,
        sum(margin_amount_used) as margin_amount
         FROM order_list WHERE order_user_id=${userId} AND order_status=0 AND market_status=0
        AND order_type=1`);
            totalSellResult = JSON.parse(JSON.stringify(totalSellResult));
            if (totalSellResult && totalSellResult.length > 0) {
                totalSellAmount =
                    +totalSellResult[0].amount /* + +totalSellResult[0].margin_amount */;
                totalSellMargin = +totalSellResult[0].margin_amount;
            }
            const query = 'select sum(wallet_trade_value) as total_value FROM wallet where wallet_user_id = ' +
                userId;
            this.walletRepository
                .execute(query)
                .then(async (result) => {
                var _a, _b;
                const data = result; //.toString().replace(/RowDataPacket/g, 'RowDataPacket:');
                result = JSON.parse(JSON.stringify(result));
                const last_recharge = await this.walletRepository.findOne({
                    where: {
                        wallet_user_id: userId,
                    },
                    order: ['wallet_created_on DESC'],
                });
                if (result && result.length > 0) {
                    const totalBalance = result[0].total_value;
                    const trade_money_balance = totalBalance - totalBuyAmount + totalSellAmount;
                    const trade_money_usable_balance = trade_money_balance - totalBuyPendingAmount;
                    const available_margin = trade_money_usable_balance * user.user_stock_margin;
                    console.log("MARGIN CALC > ", trade_money_usable_balance, user.user_stock_margin, available_margin);
                    resolve({
                        last_allocation_amount: (_a = last_recharge === null || last_recharge === void 0 ? void 0 : last_recharge.wallet_money) !== null && _a !== void 0 ? _a : 0,
                        last_allocation_date: last_recharge === null || last_recharge === void 0 ? void 0 : last_recharge.wallet_created_on,
                        trade_money_usable_balance: trade_money_usable_balance,
                        trade_money_balance: trade_money_balance,
                        // TI24-0168-002: trade money committed to unsettled buy orders. This is the
                        // same figure usable_balance subtracts: offline "requested" orders
                        // (market_status != 0) plus online "pending" limit orders (order_status = 1).
                        // Market closed -> requested + pending; once the market opens the settlement
                        // cron clears the requested rows, so it naturally becomes pending only.
                        trade_money_blocked: totalBuyPendingAmount,
                        margin_used: totalBuyMargin - totalSellMargin,
                        available_margin: available_margin
                    });
                }
                else {
                    resolve({
                        last_allocation_amount: (_b = last_recharge === null || last_recharge === void 0 ? void 0 : last_recharge.wallet_money) !== null && _b !== void 0 ? _b : 0,
                        last_allocation_date: last_recharge === null || last_recharge === void 0 ? void 0 : last_recharge.wallet_created_on,
                        trade_money_balance: 0,
                        trade_money_usable_balance: 0,
                        trade_money_blocked: totalBuyPendingAmount,
                        available_margin: 0,
                        margin_used: totalBuyMargin - totalSellMargin
                    });
                }
            })
                .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
    async getStockCountsAndMarginAmount(transactionType, userId) {
        const resultData = {
            qty: 0,
            marginAmount: 0,
        };
        let result = await this.walletRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as \
      amount, sum(margin_amount_used) as margin_amount FROM order_list WHERE order_user_id=${userId} AND \
      order_status=0 AND market_status=0 AND portfolio_status=0  \
      AND order_type=${transactionType} `);
        result = JSON.parse(JSON.stringify(result));
        if (result && result.length > 0) {
            resultData.qty = +result[0].count;
            resultData.marginAmount = +result[0].margin_amount;
        }
        return resultData;
    }
    fetchHistory(userId, limit, offset, type, startDate, endDate, search) {
        return new Promise((resolve, reject) => {
            let searchTerm = '';
            if (type) {
                switch (type) {
                    case 'recharge':
                        searchTerm = ' AND voucher_code_id = 0 ';
                        break;
                    case 'voucher':
                        searchTerm = ' AND voucher_code_id > 0 ';
                        break;
                    default:
                        throw new rest_1.HttpErrors.BadRequest();
                }
            }
            let dateQueryPart = '';
            if (startDate && endDate) {
                dateQueryPart =
                    " AND ( wallet_created_on BETWEEN STR_TO_DATE('" +
                        startDate +
                        "','%d/%m/%Y')\
       AND STR_TO_DATE('" +
                        endDate +
                        "','%d/%m/%Y') )";
            }
            let searchFilter = ' AND ';
            if (search && search.length > 0) {
                searchFilter =
                    " AND ( LOWER(payment_order_id) LIKE LOWER('" +
                        search +
                        "%') \
      OR LOWER(net_amount) LIKE LOWER('" +
                        search +
                        "%') \
      OR LOWER(wallet_money) LIKE LOWER('" +
                        search +
                        "%') \
      OR LOWER(wallet_trade_value) LIKE LOWER('" +
                        search +
                        "%') \
      OR LOWER(transaction_type) LIKE LOWER('" +
                        search +
                        "%') ) AND ";
            }
            let query = 'select * from wallet where wallet_user_id = ' +
                userId +
                ' \
    ' +
                searchFilter +
                '\
    wallet_id IS NOT NULL \
    ' +
                dateQueryPart +
                '\
    ORDER BY  wallet_id DESC \
    LIMIT ' +
                limit +
                ' offset ' +
                offset +
                ' ;  ';
            console.log('W Q', query);
            this.walletRepository
                .execute(query)
                .then(async (result) => {
                result = JSON.parse(JSON.stringify(result));
                console.log('result end');
                resolve(result);
            })
                .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
    async redeemVoucher(userId, code) {
        const currentDate = this._convertUTCDateToLocalDate(new Date());
        currentDate.setUTCHours(0, 0, 0, 0);
        const user = await this.userRepository.findOne({
            where: {
                user_id: userId,
                user_status: 1,
            },
        });
        if (!user) {
            throw new rest_1.HttpErrors.BadRequest('User not found.');
        }
        const voucher = await this.voucherRepository.findOne({
            where: {
                voucher_code: code,
                voucher_valid_from: {
                    lte: currentDate,
                },
                voucher_valid_to: {
                    gte: currentDate,
                },
            },
        });
        if (voucher) {
            if (voucher.voucher_type == 1) {
                //check its a special voucher
                //special voucher is not applicable for existing users
                if (!user.user_created_on ||
                    !(user.user_created_on >= voucher.voucher_valid_from)) {
                    throw new rest_1.HttpErrors.BadRequest('Error! Invalid voucher code.');
                }
            }
            const wallet = await this.walletRepository.findOne({
                where: {
                    voucher_code_id: voucher.voucher_id,
                    wallet_user_id: userId,
                },
            });
            if (wallet) {
                throw new rest_1.HttpErrors.BadRequest('Voucher is already redeemed.');
            }
            const margin = user.user_margin == 0 ? 1 : user.user_margin;
            await this.walletRepository.create({
                wallet_user_id: userId,
                transaction_type: 'Voucher - ' + code,
                wallet_money: voucher.voucher_amount,
                gst: 0,
                other_tax: 0,
                net_amount: voucher.voucher_amount,
                wallet_trade_value: voucher.voucher_amount * margin,
                voucher_code_id: voucher.voucher_id,
                allocate_email_status: 0,
                wallet_created_on: this._convertUTCDateToLocalDate(new Date()),
            });
            return voucher;
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('Error! Invalid voucher code.');
        }
    }
    _convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }
    async validateVoucher(userId, code) {
        const currentDate = this._convertUTCDateToLocalDate(new Date());
        currentDate.setUTCHours(0, 0, 0, 0);
        const user = await this.userRepository.findOne({
            where: {
                user_id: userId,
                user_status: 1,
            },
        });
        if (!user) {
            throw new rest_1.HttpErrors.BadRequest('User not found.');
        }
        const voucher = await this.voucherRepository.findOne({
            where: {
                voucher_code: code,
                voucher_valid_from: {
                    lte: currentDate,
                },
                voucher_valid_to: {
                    gte: currentDate,
                },
            },
        });
        if (voucher) {
            if (voucher.voucher_type == 1) {
                //check its a special voucher
                //special voucher is not applicable for existing users
                if (!user.user_created_on ||
                    !(user.user_created_on >= voucher.voucher_valid_from)) {
                    throw new rest_1.HttpErrors.BadRequest('Error! Invalid voucher code.');
                }
            }
            const wallet = await this.walletRepository.findOne({
                where: {
                    voucher_code_id: voucher.voucher_id,
                    wallet_user_id: userId,
                },
            });
            if (wallet) {
                throw new rest_1.HttpErrors.BadRequest('Voucher is already redeemed.');
            }
            const margin = user.user_margin == 0 ? 1 : user.user_margin;
            voucher.voucher_amount = voucher.voucher_amount * margin;
            return voucher;
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('Error! Invalid voucher code.');
        }
    }
};
WalletService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.WalletRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.UserRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.VoucherRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.WalletRepository,
        repositories_1.UserRepository,
        repositories_1.VoucherRepository])
], WalletService);
exports.WalletService = WalletService;
//# sourceMappingURL=wallet.service.js.map