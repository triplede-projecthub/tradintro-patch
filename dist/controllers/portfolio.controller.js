"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const portfolio_dashboard_response_model_1 = require("../models/dto/portfolio-dashboard-response.model");
const stock_transaction_model_1 = require("../models/dto/stock-transaction.model");
const services_1 = require("../services");
const security_spec_1 = require("../utils/security-spec");
const api_utils_1 = require("./api.utils");
const portfolio_dto_1 = require("./dto/portfolio.dto");
let PortfolioController = class PortfolioController {
    constructor(portfolioService, user, userService, walletService) {
        this.portfolioService = portfolioService;
        this.user = user;
        this.userService = userService;
        this.walletService = walletService;
    }
    async count(order_execution_type = '1,0', order_status = 0, portfolio_status = 0) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .count(+this.user.id, order_status, portfolio_status, order_execution_type)
                .then(count => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: count,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    async getPortfolios(startDate, endDate, search, limit = 10, offset = 0, order_execution_type = '1,0', order_status = '0', portfolio_status = '0', market_status = '0') {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .searchPortfolio(+this.user.id, search, order_execution_type, order_status, portfolio_status, market_status, limit, offset, startDate, endDate)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async getPortfoliosPending(orderType = '0,1', stockId) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .getAllPendingTransactionOfUser(+this.user.id, orderType, stockId)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async getPortfoliosV2(search, limit = 10, stockId, offset = 0, order_execution_type = '1,0', order_status = '0', portfolio_status = '0', market_status = '0', margin_status = '0') {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .searchPortfolioV2(+this.user.id, search, order_execution_type, order_status, portfolio_status, market_status, margin_status, stockId, limit, offset)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async getHistoricalOrdersReport(limit = 10, offset = 0, search, startDate, endDate) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .historicalReportPagination(+this.user.id, limit, offset, search, startDate, endDate)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async getCurrentOrdersReport(orderType, limit = 10, offset = 0, marginStatus, search, startDate, endDate) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .currentHoldingReportPagination(+this.user.id, orderType, limit, offset, marginStatus, search, startDate, endDate)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async getProfitLossSummery() {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .profitLossSummery(+this.user.id)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async getPortfolioDashboard() {
        return new Promise((resolve, reject) => {
            this.userService
                .findById(this.user.id)
                .then(async (user) => {
                var _a, _b;
                if (user && user.user_id) {
                    console.log('USER', user);
                    const dashboard = new portfolio_dashboard_response_model_1.PortfolioDashboardResponse({
                        user_id: +this.user.id,
                    });
                    const values = await this.portfolioService.userHoldingValue(dashboard.user_id);
                    console.log('VALUES', values);
                    dashboard.holding_value = (_a = values === null || values === void 0 ? void 0 : values.holding_value) !== null && _a !== void 0 ? _a : 0;
                    const prev_value = (_b = values === null || values === void 0 ? void 0 : values.prev_holding_value) !== null && _b !== void 0 ? _b : 0;
                    const wallet_amount = await this.userService.userTotalWalletAmount(dashboard.user_id);
                    const wallet_trad_value = await this.userService.userTotalTradValue(dashboard.user_id);
                    const invested_amount = await this.userService.userTotalInvestments(dashboard.user_id);
                    console.log('WALLET AMT', wallet_amount);
                    dashboard.total_investment = invested_amount;
                    dashboard.total_trade_money = wallet_trad_value;
                    dashboard.trade_money_balance =
                        wallet_trad_value - invested_amount;
                    dashboard.holding_value_diff =
                        dashboard.holding_value - dashboard.total_investment;
                    dashboard.holding_value_diff_percentage =
                        ((dashboard.holding_value - dashboard.total_investment) /
                            ((dashboard.holding_value + dashboard.total_investment) /
                                2)) *
                            100;
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: dashboard,
                        status: true,
                        statusCode: 200,
                        message: 'OK',
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.Unauthorized('Invalid credentials'));
                }
            })
                .catch(error => reject(error));
        });
    }
    async getPortfolioDashboardV2(marginStatus) {
        return new Promise((resolve, reject) => {
            this.userService
                .findById(this.user.id)
                .then(async (user) => {
                if (user === null || user === void 0 ? void 0 : user.user_id) {
                    console.log('USER', user);
                    const dashboard = new portfolio_dashboard_response_model_1.PortfolioDashboardResponse({
                        user_id: +this.user.id,
                    });
                    const values = await this.portfolioService.userHoldingValueV2(dashboard.user_id, marginStatus);
                    dashboard.total_investment = this.limitDecimalPoints(values.total_investment);
                    const walletTradValue = await this.userService.userTotalTradValue(dashboard.user_id);
                    const summery = await this.walletService.getWalletSummery(+this.user.id);
                    // dashboard.trade_money_balance = this.limitDecimalPoints((walletTradValue - values.total_buy_amount) + values.total_sell_amount);
                    dashboard.trade_money_balance = this.limitDecimalPoints(summery.trade_money_balance);
                    //values.holding_value=90860898.99;
                    dashboard.holding_value = this.limitDecimalPoints(values.holding_value);
                    dashboard.total_trade_money = walletTradValue;
                    dashboard.total_portfolio_qty = values.totalPortfolioQuantity;
                    dashboard.holding_value_diff = values === null || values === void 0 ? void 0 : values.portfolio_change;
                    dashboard.holding_value_diff_percentage =
                        values === null || values === void 0 ? void 0 : values.portfolio_change_percentage;
                    if (marginStatus === '1') {
                        dashboard.tradeMoneyUsed = this.limitDecimalPoints(values.tradeMoneyUsed);
                        dashboard.usedMargin = this.limitDecimalPoints(values.usedMargin);
                    }
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: dashboard,
                        status: true,
                        statusCode: 200,
                        message: 'OK',
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.Unauthorized('Invalid credentials'));
                }
            })
                .catch(error => reject(error));
        });
    }
    limitDecimalPoints(amount, limit = 3) {
        //return Math.trunc(amount * Math.pow(10, 2)) / Math.pow(10, 2);
        return this.roundNumberV1(+amount.toFixed(limit), 2);
    }
    roundNumberV1(num, scale) {
        if (!('' + num).includes('e')) {
            return +(Math.round(+(num + 'e+' + scale)) + 'e-' + scale);
        }
        else {
            const arr = ('' + num).split('e');
            let sig = '';
            if (+arr[1] + scale > 0) {
                sig = '+';
            }
            const i = +arr[0] + 'e' + sig + (+arr[1] + scale);
            const j = Math.round(+i);
            const k = +(j + 'e-' + scale);
            return k;
        }
    }
    async getPortfolioDashboardForStock(stockId, marginStatus) {
        return new Promise((resolve, reject) => {
            this.userService
                .findById(this.user.id)
                .then(async (user) => {
                if (user === null || user === void 0 ? void 0 : user.user_id) {
                    const data = await this.portfolioService.userHoldingValueOfStock(user.user_id, stockId, marginStatus);
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: data,
                        status: true,
                        statusCode: 200,
                        message: 'OK',
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.Unauthorized('Invalid credentials'));
                }
            })
                .catch(error => reject(error));
        });
    }
    async findById(id) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .findById(id, +this.user.id)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result !== null && result !== void 0 ? result : undefined,
                    status: true,
                    statusCode: result == null ? 204 : 200,
                    message: 'OK',
                }));
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    async getPortfolioTransactions(stockId, orderStatus = '0', portfolioStatus = '0') {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .getPortfolioTransactions(stockId, +this.user.id, orderStatus, portfolioStatus)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result !== null && result !== void 0 ? result : undefined,
                    status: true,
                    statusCode: result == null ? 204 : 200,
                    message: 'OK',
                }));
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    async setPortfolioAlert(id, alertRequest) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .setAlertForPortfolio(id, +this.user.id, alertRequest.amount)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: result ? 200 : 204,
                    message: 'OK',
                }));
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    async removePortfolioAlert(alertId) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .removeAlertForPortfolio(alertId, +this.user.id)
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: { count: result },
                    status: true,
                    statusCode: result == 0 ? 204 : 200,
                    message: 'OK',
                }));
            })
                .catch(err => {
                reject(err);
            });
        });
    }
    async deleteUserAccount(id) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .deleteOrder(+this.user.id, id)
                .then(count => {
                if (count) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: count,
                        status: true,
                        statusCode: 200,
                        message: 'OK',
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.BadRequest());
                }
            })
                .catch(error => reject(error));
        });
    }
    async buyStock(id, stockTransaction) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .buyStock(id, +this.user.id, stockTransaction)
                .then(portfolio => {
                return resolve((0, api_utils_1.generateApiResponse)({
                    data: portfolio,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async sellStock(id, stockTransaction) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .sellStock(id, +this.user.id, stockTransaction)
                .then(portfolio => {
                return resolve((0, api_utils_1.generateApiResponse)({
                    data: portfolio,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async sellStockUpdate(orderId, stockTransaction) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .sellStockRequestUpdate(+orderId, +this.user.id, stockTransaction)
                .then(portfolio => {
                return resolve((0, api_utils_1.generateApiResponse)({
                    data: portfolio,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async buyStockUpdate(orderId, stockTransaction) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .buyStockRequestUpdate(+orderId, +this.user.id, stockTransaction)
                .then(portfolio => {
                return resolve((0, api_utils_1.generateApiResponse)({
                    data: portfolio,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
    async stockRequestCancel(orderId) {
        return new Promise((resolve, reject) => {
            this.portfolioService
                .stockRequestCancelUpdate(+orderId, +this.user.id)
                .then(portfolio => {
                return resolve((0, api_utils_1.generateApiResponse)({
                    data: portfolio,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch(error => reject(error));
        });
    }
};
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/portfolio/count', {
        description: 'Portfolios count.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('order_execution_type', {
        optional: true,
        default: '1,0',
        description: '`1` for pending purchases and `0` for completed. Ignore for all orders or pass status as csv.',
    })),
    tslib_1.__param(1, rest_1.param.query.number('order_status', {
        optional: true,
        default: 0,
    })),
    tslib_1.__param(2, rest_1.param.query.number('portfolio_status', {
        optional: true,
        default: 0,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "count", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/portfolio', {
        description: 'API for get users portfolio list data.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('startDate', { optional: true })),
    tslib_1.__param(1, rest_1.param.query.string('endDate', { optional: true })),
    tslib_1.__param(2, rest_1.param.query.string('search', { optional: true })),
    tslib_1.__param(3, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(4, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__param(5, rest_1.param.query.string('order_execution_type', {
        optional: true,
        default: '1,0',
        description: '`1` for Limit and `0` for Market. Ignore for all orders or pass status as csv.',
    })),
    tslib_1.__param(6, rest_1.param.query.string('order_status', {
        optional: true,
        default: '0',
        description: '`0` executed (default) `1` pending `2` cancelled `3` expired `4` rejected. \
       Ignore for executed orders or pass status as csv.',
    })),
    tslib_1.__param(7, rest_1.param.query.string('portfolio_status', {
        optional: true,
        default: '0',
        description: '`0` current (default), `1`  historical. \
      Ignore for current holdings or pass status as csv.',
    })),
    tslib_1.__param(8, rest_1.param.query.string('market_status', {
        optional: true,
        default: '0',
        description: '`0` open (default), `1`  close. \
      pass status as csv.',
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, String, String, Object, Object, Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getPortfolios", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/portfolio/pending', {
        description: 'API for get users portfolio list data.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('order_type', {
        optional: true,
        default: '0',
        description: ' `0` for BUY, `1` for SELL \
      (CSV supported - default 0,1)',
    })),
    tslib_1.__param(1, rest_1.param.query.string('stock_id', {
        optional: true,
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getPortfoliosPending", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('v2/portfolio', {
        description: 'API for get users portfolio list data.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('search', { optional: true })),
    tslib_1.__param(1, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(2, rest_1.param.query.number('stockId', { optional: true })),
    tslib_1.__param(3, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__param(4, rest_1.param.query.string('order_execution_type', {
        optional: true,
        default: '1,0',
        description: '`1` for Limit and `0` for Market. Ignore for all orders or pass status as csv.',
    })),
    tslib_1.__param(5, rest_1.param.query.string('order_status', {
        optional: true,
        default: '0',
        description: '`0` executed (default) `1` pending `2` cancelled `3` expired `4` rejected. \
       Ignore for executed orders or pass status as csv.',
    })),
    tslib_1.__param(6, rest_1.param.query.string('portfolio_status', {
        optional: true,
        default: '0',
        description: '`0` current (default), `1`  historical. \
      Ignore for current holdings or pass status as csv.',
    })),
    tslib_1.__param(7, rest_1.param.query.string('market_status', {
        optional: true,
        default: '0',
        description: '`0` online, `1`  offline. \
      Ignore for open market status or pass status as csv.',
    })),
    tslib_1.__param(8, rest_1.param.query.string('margin_status', {
        optional: true,
        default: '0',
        description: '`0` holdings, `1`  position. \
      Ignore for open market status or pass status as csv.',
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, String, Object, Object, Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getPortfoliosV2", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/reports/historical', {
        description: 'API for get historical orders report.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(1, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__param(2, rest_1.param.query.string('search', { optional: true })),
    tslib_1.__param(3, rest_1.param.query.string('startDate', { optional: true })),
    tslib_1.__param(4, rest_1.param.query.string('endDate', { optional: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getHistoricalOrdersReport", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/reports/current', {
        description: 'API for get current orders report.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('orderType', { optional: true, default: '0' })),
    tslib_1.__param(1, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(2, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__param(3, rest_1.param.query.string('marginStatus', { optional: true })),
    tslib_1.__param(4, rest_1.param.query.string('search', { optional: true })),
    tslib_1.__param(5, rest_1.param.query.string('startDate', { optional: true })),
    tslib_1.__param(6, rest_1.param.query.string('endDate', { optional: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object, String, String, String, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getCurrentOrdersReport", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/reports/profit-loss/summery', {
        description: 'API for get profit/loss summery.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PROFIT_LOSS_SUMMERY_RESPONSE,
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getProfitLossSummery", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/portfolio/dashboard', {
        description: 'API for get users portfolio dashboard data.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_DASHBOARD_RESPONSE,
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getPortfolioDashboard", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/v2/portfolio/dashboard', {
        description: 'API for get users portfolio dashboard data.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_DASHBOARD_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('marginStatus', { optional: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getPortfolioDashboardV2", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/v2/portfolio/{stockId}/dashboard', {
        description: 'API for get users portfolio dashboard data.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_DASHBOARD_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('stockId')),
    tslib_1.__param(1, rest_1.param.query.string('marginStatus', { optional: true })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getPortfolioDashboardForStock", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/portfolio/{id}', {
        description: 'Portfolio item by portfolio id.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "findById", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/portfolio/transactions/{stockId}', {
        description: 'Portfolio transactions of stock by user.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('stockId')),
    tslib_1.__param(1, rest_1.param.query.string('order_status', {
        optional: true,
        default: '0',
        description: ' `0` for EXECUTED, `1` for PENDING \
      `2` for CANCELLED, `3` for EXPIRED, `4` for REJECTED. (CSV supported)',
    })),
    tslib_1.__param(2, rest_1.param.query.string('portfolio_status', {
        optional: true,
        default: '0',
        description: ' `0` for CURRENT HOLDINGS, \
      `1` for HISTORICAL. (CSV supported)',
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "getPortfolioTransactions", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/portfolio/{id}/alert', {
        description: 'Set/Modify alert for a portfolio stock.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    title: 'AlertRequest',
                    properties: {
                        amount: { type: 'number' },
                    },
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "setPortfolioAlert", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.del)('/portfolio/alert/{alertId}', {
        description: 'Delete alert for a portfolio stock.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('alertId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "removePortfolioAlert", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.del)('/portfolio/{id}', {
        description: 'Delete user account.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "deleteUserAccount", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/portfolio/{id}/buy', {
        description: 'Buy stock.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(stock_transaction_model_1.StockTransaction, {
                    title: 'StockTransaction',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, stock_transaction_model_1.StockTransaction]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "buyStock", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/portfolio/{id}/sell', {
        description: 'Sell stock.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(stock_transaction_model_1.StockTransaction, {
                    title: 'StockTransaction',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, stock_transaction_model_1.StockTransaction]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "sellStock", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.patch)('/portfolio/sell/{orderId}', {
        description: 'Sell stock update.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('orderId')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(stock_transaction_model_1.StockTransaction, {
                    title: 'StockTransaction',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, stock_transaction_model_1.StockTransaction]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "sellStockUpdate", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.patch)('/portfolio/buy/{orderId}', {
        description: 'Buy stock update.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('orderId')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(stock_transaction_model_1.StockTransaction, {
                    title: 'StockTransaction',
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, stock_transaction_model_1.StockTransaction]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "buyStockUpdate", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.del)('/portfolio/{orderId}', {
        description: 'Sell stock request cancel.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': portfolio_dto_1.PORTFOLIO_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('orderId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], PortfolioController.prototype, "stockRequestCancel", null);
PortfolioController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(services_1.PortfolioService)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    tslib_1.__param(2, (0, core_1.service)(services_1.ProfileUserService)),
    tslib_1.__param(3, (0, core_1.service)(services_1.WalletService)),
    tslib_1.__metadata("design:paramtypes", [services_1.PortfolioService, Object, services_1.ProfileUserService,
        services_1.WalletService])
], PortfolioController);
exports.PortfolioController = PortfolioController;
//# sourceMappingURL=portfolio.controller.js.map