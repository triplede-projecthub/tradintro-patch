"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COUNT_RESPONSE = exports.NOTIFICATION_BY_ID_RESPONSE = exports.NOTIFICATION_LIST_RESPONSE = void 0;
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../../models");
/**
 * OpenAPI response for notifications()
 */
exports.NOTIFICATION_LIST_RESPONSE = {
    description: 'Array of notifications for user.',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'NotificationListResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'array',
                        items: (0, rest_1.getModelSchemaRef)(models_1.Notifications, { includeRelations: false }),
                    },
                },
            },
        },
    }
};
/**
 * OpenAPI response for notifications/{id}()
 */
exports.NOTIFICATION_BY_ID_RESPONSE = {
    description: 'Notification model instance by id',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'NotificationByIdResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(models_1.Notifications, { includeRelations: false })
                },
            },
        },
    }
};
exports.COUNT_RESPONSE = {
    description: 'Notification model instance by id',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'CountResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: repository_1.CountSchema
                },
            },
        },
    }
};
//# sourceMappingURL=notifications.dto.js.map