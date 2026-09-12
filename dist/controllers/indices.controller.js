"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicesController = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const services_1 = require("../services");
const constants_1 = require("../utils/constants");
const api_utils_1 = require("./api.utils");
let IndicesController = class IndicesController {
    constructor(indicesService, portfolioService) {
        this.indicesService = indicesService;
        this.portfolioService = portfolioService;
    }
    async find(indicesId) {
        const filter = indicesId
            ? {
                where: {
                    indices_id: indicesId,
                },
            }
            : undefined;
        return new Promise((resolve, reject) => {
            this.indicesService
                .find(filter)
                .then(async (result) => {
                const marketStatus = await this.portfolioService.getMarketStatus(this.portfolioService._convertUTCDateToLocalDate(new Date()));
                if (marketStatus == constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
                    for (const item of result) {
                        item.indices_close = 0; // Set indices_close to 0 for each object
                        item.prepareForResponse();
                    }
                }
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK',
                }));
            })
                .catch((error) => reject(error));
        });
    }
};
tslib_1.__decorate([
    (0, rest_1.get)('/indices'),
    (0, rest_1.response)(200, {
        description: 'Array of Indices model instances',
        content: {
            'application/json': {
                schema: {
                    type: 'array',
                    items: (0, rest_1.getModelSchemaRef)(models_1.Indices, { includeRelations: true }),
                },
            },
        },
    }),
    tslib_1.__param(0, rest_1.param.query.number('indices_id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], IndicesController.prototype, "find", null);
IndicesController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(services_1.IndicesService)),
    tslib_1.__param(1, (0, core_1.service)(services_1.PortfolioService)),
    tslib_1.__metadata("design:paramtypes", [services_1.IndicesService,
        services_1.PortfolioService])
], IndicesController);
exports.IndicesController = IndicesController;
//# sourceMappingURL=indices.controller.js.map