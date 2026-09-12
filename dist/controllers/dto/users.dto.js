"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.INVITES_LIST_RESPONSE = exports.COUNT_RESPONSE = exports.USER_DASHBOARD_RESPONSE = exports.TAX_RESPONSE = exports.USER_BY_ID_RESPONSE = exports.USER_LOGIN_RESPONSE = void 0;
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../../models");
const dashboard_response_data_model_1 = require("../../models/dto/dashboard-response-data.model");
const tax_model_1 = require("../../models/tax.model");
/**
 * OpenAPI response for users/login()
 */
exports.USER_LOGIN_RESPONSE = {
    description: 'User Login Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'UserLoginResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'object',
                        properties: {
                            token: {
                                type: "string"
                            },
                            refresh_token: {
                                type: "string"
                            },
                            pkiKey: {
                                type: "string"
                            },
                        }
                    },
                },
            },
        },
    }
};
/**
 * OpenAPI response for users/{id}()
 */
exports.USER_BY_ID_RESPONSE = {
    description: 'User Details By ID Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'UserModelResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(models_1.User, { includeRelations: false }),
                },
            },
        },
    }
};
exports.TAX_RESPONSE = {
    description: 'Tax Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'TaxModelResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'array',
                        items: (0, rest_1.getModelSchemaRef)(tax_model_1.Tax),
                    },
                },
            },
        },
    }
};
/**
* OpenAPI response for users/dashboard()
*/
exports.USER_DASHBOARD_RESPONSE = {
    description: 'User Dashboard Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'UserDashboardResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(dashboard_response_data_model_1.DashboardResponseData),
                },
            },
        },
    }
};
exports.COUNT_RESPONSE = {
    description: 'Count',
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
/**
 * OpenAPI response for [GET] /invites/history()
 */
exports.INVITES_LIST_RESPONSE = {
    description: 'Array of user invite model instances',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'InviteListResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'array',
                        items: (0, rest_1.getModelSchemaRef)(models_1.UserInvite, { includeRelations: false }),
                    },
                },
            },
        },
    }
};
//# sourceMappingURL=users.dto.js.map