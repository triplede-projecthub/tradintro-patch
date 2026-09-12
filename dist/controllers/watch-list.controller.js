"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchListController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const services_1 = require("../services");
const constants_1 = require("../utils/constants");
const security_spec_1 = require("../utils/security-spec");
const api_utils_1 = require("./api.utils");
const watchlist_dto_1 = require("./dto/watchlist.dto");
let WatchListController = class WatchListController {
    constructor(watchListService, portfolioService, user) {
        this.watchListService = watchListService;
        this.portfolioService = portfolioService;
        this.user = user;
    }
    async create(watchList) {
        return new Promise((resolve, reject) => {
            this.watchListService.create(watchList, +(this.user.id)).then((response) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: response,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => { reject(error); });
        });
    }
    async count() {
        return new Promise((resolve, reject) => {
            this.watchListService.count({
                watchlist_user_id: +(this.user.id)
            }).then((count) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: count,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async find(search, limit = 10, offset = 0) {
        return new Promise((resolve, reject) => {
            if (search != undefined) {
                this.watchListService.searchWatchList(+(this.user.id), search, limit, offset).then((result) => {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: result,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }).catch((error) => reject(error));
            }
            else {
                this.watchListService.find(+(this.user.id), limit, offset).then((data) => {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: data,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }).catch((error) => reject(error));
            }
        });
    }
    async findById(id) {
        return new Promise((resolve, reject) => {
            this.watchListService.findById(id, +(this.user.id)).then(async (result) => {
                if (result == null) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        status: true,
                        statusCode: 204,
                        message: 'OK'
                    }));
                }
                else {
                    const marketStatus = await this.portfolioService.getMarketStatus(this.portfolioService._convertUTCDateToLocalDate(new Date()));
                    console.log("🚀 ~ WatchListController ~ this.watchListService.findById ~ marketStatus:", marketStatus);
                    if (marketStatus == constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
                        if (result.market && result.market.history && result.market.history.length > 0) {
                            result.market.history[0].stock_history_close = 0;
                        }
                    }
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: result,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
            }).catch((error) => reject(error));
        });
    }
    async updateById(id, watchList) {
        return new Promise((resolve, reject) => {
            this.watchListService.updateById(id, +(this.user.id), watchList).then((result) => {
                if (result == null) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        status: true,
                        statusCode: 204,
                        message: 'OK'
                    }));
                }
                else {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: result,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
            }).catch((error) => reject(error));
        });
    }
    async deleteById(id) {
        return new Promise((resolve, reject) => {
            this.watchListService.deleteById(id, +(this.user.id)).then(count => {
                if (count.count == 0) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        status: true,
                        statusCode: 204,
                        message: 'OK'
                    }));
                }
                else
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: count,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
            }).catch(e => reject(e));
        });
    }
    async setWatchListAlert(id, alertRequest) {
        return new Promise((resolve, reject) => {
            this.watchListService.setAlertForWatchList(id, +(this.user.id), alertRequest.amount).then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: { count: result },
                    status: true,
                    statusCode: result == 0 ? 204 : 200,
                    message: 'OK'
                }));
            }).catch(err => { reject(err); });
        });
    }
    async removeWatchListAlert(alertId) {
        return new Promise((resolve, reject) => {
            this.watchListService.removeAlertForWatchList(alertId, +(this.user.id))
                .then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: { count: result },
                    status: true,
                    statusCode: result == 0 ? 204 : 200,
                    message: 'OK'
                }));
            }).catch(err => { reject(err); });
        });
    }
};
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/watch-lists', {
        description: 'Add to watch list.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': watchlist_dto_1.WATCHLIST_MODEL_RESPONSE,
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.WatchList, {
                    title: 'NewWatchList',
                    exclude: ['watchlist_user_id', 'watchlist_id', 'watchlist_date'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WatchListController.prototype, "create", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/watch-lists/count', {
        description: 'WatchList Count.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': watchlist_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], WatchListController.prototype, "count", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/watch-lists', {
        description: 'WatchList Pagination.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': watchlist_dto_1.WATCHLIST_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('search', { optional: true })),
    tslib_1.__param(1, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(2, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WatchListController.prototype, "find", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/watch-lists/{id}', {
        description: 'WatchList Model.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': watchlist_dto_1.WATCHLIST_MODEL_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], WatchListController.prototype, "findById", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.patch)('/watch-lists/{id}', {
        description: 'WatchList Update (Alert Price).',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': watchlist_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(models_1.WatchList, {
                    title: 'UpdateWatchListAlert',
                    exclude: ['watchlist_user_id', 'watchlist_stock_id', 'watchlist_id', 'watchlist_date'],
                }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WatchListController.prototype, "updateById", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.del)('/watch-lists/{id}', {
        description: 'WatchList Delete.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': watchlist_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], WatchListController.prototype, "deleteById", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/watch-lists/{id}/alert', {
        description: 'Set/Modify alert for a watch-list stock.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': watchlist_dto_1.COUNT_RESPONSE,
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
                    }
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], WatchListController.prototype, "setWatchListAlert", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.del)('/watch-lists/alert/{alertId}', {
        description: 'Remove alert for a watch list.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': watchlist_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('alertId')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], WatchListController.prototype, "removeWatchListAlert", null);
WatchListController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(services_1.WatchListService)),
    tslib_1.__param(1, (0, core_1.service)(services_1.PortfolioService)),
    tslib_1.__param(2, (0, core_1.inject)(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [services_1.WatchListService,
        services_1.PortfolioService, Object])
], WatchListController);
exports.WatchListController = WatchListController;
//# sourceMappingURL=watch-list.controller.js.map