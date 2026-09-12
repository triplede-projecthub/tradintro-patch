"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STOCK_BY_ID_RESPONSE = exports.USER_POINTS_LIST_RESPONSE = exports.USER_LEVEL_LIST_RESPONSE = void 0;
const rest_1 = require("@loopback/rest");
const market_model_1 = require("../../models/market.model");
const models_1 = require("../../models");
/**
 * OpenAPI response for [GET] /user-levels
 */
exports.USER_LEVEL_LIST_RESPONSE = {
    description: 'Array of User Level model instances',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'UserLevelResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'object',
                        properties: {
                            myLevel: { type: 'number' },
                            myPoints: { type: 'number' },
                            levels: {
                                type: 'array',
                                items: (0, rest_1.getModelSchemaRef)(models_1.UserLevelPoints)
                            }
                        }
                    },
                },
            },
        },
    }
};
exports.USER_POINTS_LIST_RESPONSE = {
    description: 'Array of user points history instances',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'UserPointsHistoryResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'object',
                        properties: {
                            myLevel: { type: 'number' },
                            myPoints: { type: 'number' },
                            levels: {
                                type: 'array',
                                items: (0, rest_1.getModelSchemaRef)(models_1.UserPoints)
                            }
                        }
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
//# sourceMappingURL=user-level.dto.js.map