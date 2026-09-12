"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WALLET_SUMMERY_RESPONSE = exports.VOUCHER_RESPONSE = exports.WALLET_RESPONSE = exports.WALLET_HISTORY_LIST_RESPONSE = void 0;
const rest_1 = require("@loopback/rest");
const models_1 = require("../../models");
const wallet_summery_response_model_1 = require("../../models/dto/wallet-summery-response.model");
/**
 * OpenAPI response for wallet/history()
 */
exports.WALLET_HISTORY_LIST_RESPONSE = {
    description: 'Array of Recharge/Voucher-Redeem History',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'WalletHistoryResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'array',
                        items: (0, rest_1.getModelSchemaRef)(models_1.Wallet, { includeRelations: false }),
                    },
                },
            },
        },
    }
};
/**
 * OpenAPI response for wallet/{id}()
 */
exports.WALLET_RESPONSE = {
    description: 'Wallet model instance',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'WalletResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(models_1.Wallet, { includeRelations: false })
                },
            },
        },
    }
};
exports.VOUCHER_RESPONSE = {
    description: 'Voucher model instance',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'WalletResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(models_1.Voucher)
                },
            },
        },
    }
};
/**
 * OpenAPI response for wallet/summery()
 */
exports.WALLET_SUMMERY_RESPONSE = {
    description: 'Wallet Summery',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'WalletSummeryResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(wallet_summery_response_model_1.WalletSummeryResponse, { includeRelations: false })
                },
            },
        },
    }
};
//# sourceMappingURL=wallet.dto.js.map