"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const services_1 = require("../services");
const constants_1 = require("../utils/constants");
const security_spec_1 = require("../utils/security-spec");
const api_utils_1 = require("./api.utils");
const market_dto_1 = require("./dto/market.dto");
const notifications_dto_1 = require("./dto/notifications.dto");
let MarketController = class MarketController {
    constructor(marketService, portfolioService, user) {
        this.marketService = marketService;
        this.portfolioService = portfolioService;
        this.user = user;
    }
    async count(where) {
        return new Promise((resolve, reject) => {
            this.marketService.count(where).then((result) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async find(search, stock_type = '0', stock_status = '0', stock_indices_id = '0', limit = 10, offset = 0) {
        return new Promise((resolve, reject) => {
            this.marketService.find(this.user.id, limit, offset, stock_type, stock_status, stock_indices_id, search).then((result) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async findById(id, appendPending) {
        console.log('appendPending', appendPending);
        const filter = {};
        const history_relation = {
            relation: 'history',
            scope: {
                limit: 4,
                order: ['stock_history_date DESC'],
            }
        };
        const stock_info_relation = {
            relation: 'stockInfo'
        };
        const watchlist_relation = {
            relation: 'watchlist',
            scope: {
                where: {
                    watchlist_user_id: this.user.id
                }
            }
        };
        const portfolioRelation = {
            relation: 'portfolioItems',
            scope: {
                where: {
                    portfolio_status: 0,
                    order_status: {
                        inq: appendPending ? [0, 1] : [0]
                    },
                    market_status: { inq: appendPending ? [0, 1] : [0] },
                    order_user_id: this.user.id
                }
            }
        };
        const alertRelation = {
            relation: 'alert',
            scope: {
                where: {
                    notification_type: 1,
                    notification_user_id: this.user.id,
                    notification_status: 0
                }
            }
        };
        filter.include = [history_relation, watchlist_relation, portfolioRelation,
            alertRelation, stock_info_relation];
        return new Promise((resolve, reject) => {
            this.marketService.findById(id, filter).then(async (result) => {
                console.log("🚀 ~ MarketController ~ this.marketService.findById ~ result:", result);
                const marketStatus = await this.portfolioService.getMarketStatus(this.portfolioService._convertUTCDateToLocalDate(new Date()));
                console.log("🚀 ~ MarketController ~ this.marketService.findById ~ new Date():", new Date());
                if (marketStatus == constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
                    if (result.history && result.history.length > 0) {
                        result.history[0].stock_history_close = 0;
                    }
                }
                return resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async findTransactionForMarketById(id, orderStatus = '0,1', portfolioStatus = '0', marketStatus = "0,1") {
        return new Promise((resolve, reject) => {
            this.marketService.findTransactionForMarketById(id, +(this.user.id), orderStatus, portfolioStatus, marketStatus).then((result) => {
                return resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async findSimilarStocks(stockId, limit = 3) {
        return new Promise((resolve, reject) => {
            this.marketService.findSimilarStocks(this.user.id, stockId, limit).then((result) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async getNewsOfStock(stockId, notification_type = '3', search, limit = 10, offset = 0, stockNews = true) {
        return new Promise((resolve, reject) => {
            this.marketService.getStockNews(this.user.id, stockId, notification_type, search, limit, offset, stockNews).then((result) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async getMarketDateOfStock(stockCode) {
        try {
            return await this.marketService.getMarketDateOfStock(stockCode);
        }
        catch (err) {
            throw new rest_1.HttpErrors.BadRequest(err.message);
        }
    }
};
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/market/count', {
        description: 'Get total stocks available in market.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': market_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.where(models_1.Market)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketController.prototype, "count", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/market', {
        description: 'Get list of stocks available in market.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': market_dto_1.MARKET_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('search', { optional: true })),
    tslib_1.__param(1, rest_1.param.query.string('stock_type', {
        optional: true,
        default: '0',
        description: ' `0` for NSE. (CSV supported)'
    })),
    tslib_1.__param(2, rest_1.param.query.string('stock_status', {
        optional: true,
        default: '0',
        description: ' `0` for Active `1` for Inactive. (CSV supported)'
    })),
    tslib_1.__param(3, rest_1.param.query.string('stock_indices_id', {
        optional: true,
        default: '0',
        description: ' `0` for All and indices id for filter'
    })),
    tslib_1.__param(4, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(5, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketController.prototype, "find", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/market/{id}', {
        description: 'Get stock details by ID (stock_id).',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': market_dto_1.STOCK_BY_ID_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.query.boolean('appendPending', { optional: true, default: false })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Boolean]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketController.prototype, "findById", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/market/{id}/transactions', {
        description: 'Get transactions list stock_id.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': market_dto_1.STOCK_BY_ID_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, rest_1.param.query.string('order_status', {
        optional: true,
        default: '0',
        description: ' `0` for EXECUTED, `1` for PENDING \
      `2` for CANCELLED, `3` for EXPIRED, `4` for REJECTED. (CSV supported - default 0,1)'
    })),
    tslib_1.__param(2, rest_1.param.query.string('portfolio_status', {
        optional: true,
        default: '0',
        description: ' `0` for CURRENT HOLDINGS, \
      `1` for HISTORICAL. (CSV supported)'
    })),
    tslib_1.__param(3, rest_1.param.query.string('market_status', {
        optional: true,
        default: "0",
        description: '`0` online, `1`  offline. \
      Ignore for open market status or pass status as csv (default 0,1).'
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketController.prototype, "findTransactionForMarketById", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/market/{stockId}/similar', {
        description: 'Get list of similar stocks available in market.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': market_dto_1.MARKET_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('stockId')),
    tslib_1.__param(1, rest_1.param.query.number('limit', { optional: true, default: 3 })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketController.prototype, "findSimilarStocks", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/market/{stockId}/news', {
        description: 'Get list news related to the specified stock.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': notifications_dto_1.NOTIFICATION_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('stockId')),
    tslib_1.__param(1, rest_1.param.query.string('notification_type', {
        optional: true,
        description: 'types as csv',
        default: '3'
    })),
    tslib_1.__param(2, rest_1.param.query.string('search', { optional: true })),
    tslib_1.__param(3, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(4, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__param(5, rest_1.param.query.boolean('stockNews', { optional: true, default: false })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object, String, Object, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketController.prototype, "getNewsOfStock", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/market/date/{stockCode}', {
        description: 'Get market updated date of the specified stock.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': {},
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('stockCode')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], MarketController.prototype, "getMarketDateOfStock", null);
MarketController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(services_1.MarketService)),
    tslib_1.__param(1, (0, core_1.service)(services_1.PortfolioService)),
    tslib_1.__param(2, (0, core_1.inject)(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [services_1.MarketService,
        services_1.PortfolioService, Object])
], MarketController);
exports.MarketController = MarketController;
//# sourceMappingURL=market.controller.js.map