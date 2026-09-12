"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WATCHLIST_MODEL_RESPONSE = exports.WATCHLIST_LIST_RESPONSE = exports.COUNT_RESPONSE = void 0;
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../../models");
/**
 * OpenAPI response for count()
 */
exports.COUNT_RESPONSE = {
    description: 'count',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'CountResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: repository_1.CountSchema,
                },
            },
        },
    }
};
/**
 * OpenAPI response for [GET] watch-list()
 */
exports.WATCHLIST_LIST_RESPONSE = {
    description: 'Array of Watchlist model instances',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'WatchListResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'array',
                        items: (0, rest_1.getModelSchemaRef)(models_1.WatchList, { includeRelations: false }),
                    },
                },
            },
        },
    }
};
/**
 * OpenAPI response for [POST] watch-lists()
 */
exports.WATCHLIST_MODEL_RESPONSE = {
    description: 'Watch-list model',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'WatchListModelResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(models_1.WatchList, { includeRelations: false })
                },
            },
        },
    }
};
//# sourceMappingURL=watchlist.dto.js.map