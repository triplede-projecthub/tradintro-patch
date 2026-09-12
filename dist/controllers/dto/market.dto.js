"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PORTFOLIO_LIST_RESPONSE = exports.STOCK_BY_ID_RESPONSE = exports.MARKET_LIST_RESPONSE = exports.COUNT_RESPONSE = void 0;
const rest_1 = require("@loopback/rest");
const models_1 = require("../../models");
const market_model_1 = require("../../models/market.model");
/**
 * OpenAPI response for count()
 */
exports.COUNT_RESPONSE = {
    description: 'MarketList model count',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'MarketCountResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: "object",
                        properties: {
                            count: {
                                type: "number"
                            }
                        }
                    },
                },
            },
        },
    }
};
/**
 * OpenAPI response for market()
 */
exports.MARKET_LIST_RESPONSE = {
    description: 'Array of Market model instances',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'MarketListResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'array',
                        items: (0, rest_1.getModelSchemaRef)(market_model_1.Market, { includeRelations: false }),
                    },
                },
            },
        },
    }
};
/**
 * OpenAPI response for market/{id}()
 */
exports.STOCK_BY_ID_RESPONSE = {
    description: 'Market model instance by id',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'StockByIdResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(market_model_1.Market, { includeRelations: false })
                },
            },
        },
    }
};
exports.PORTFOLIO_LIST_RESPONSE = {
    description: 'Array of portfolio',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'TRansactionListResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'array',
                        items: (0, rest_1.getModelSchemaRef)(models_1.PortfolioItem, { includeRelations: false }),
                    },
                },
            },
        },
    }
};
//# sourceMappingURL=market.dto.js.map