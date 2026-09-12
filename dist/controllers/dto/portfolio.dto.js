"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COUNT_RESPONSE = exports.PROFIT_LOSS_SUMMERY_RESPONSE = exports.PORTFOLIO_RESPONSE = exports.PORTFOLIO_LIST_RESPONSE = exports.PORTFOLIO_DASHBOARD_RESPONSE = void 0;
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../../models");
const portfolio_dashboard_response_model_1 = require("../../models/dto/portfolio-dashboard-response.model");
/**
 * OpenAPI response for portfolio/dashboard()
 */
exports.PORTFOLIO_DASHBOARD_RESPONSE = {
    description: 'Portfolio Dashboard Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'PortfolioDashboardResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(portfolio_dashboard_response_model_1.PortfolioDashboardResponse),
                },
            },
        },
    }
};
exports.PORTFOLIO_LIST_RESPONSE = {
    description: 'Portfolio List Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'PortfolioListResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: {
                        type: 'array',
                        items: (0, rest_1.getModelSchemaRef)(models_1.PortfolioItem, { includeRelations: false })
                    },
                },
            },
        },
    }
};
exports.PORTFOLIO_RESPONSE = {
    description: 'Portfolio Item Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'PortfolioItemResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(models_1.PortfolioItem, { includeRelations: false }),
                },
            },
        },
    }
};
exports.PROFIT_LOSS_SUMMERY_RESPONSE = {
    description: 'Profit/Loss Summery Response',
    content: {
        'application/json': {
            schema: {
                type: 'object',
                title: 'ProfitLossSummeryResponse',
                properties: {
                    message: { type: 'string', default: 'OK' },
                    status: { type: 'boolean', default: true },
                    statusCode: { type: 'number', default: 200 },
                    data: (0, rest_1.getModelSchemaRef)(models_1.ProfitLossSummery, { includeRelations: false }),
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
//# sourceMappingURL=portfolio.dto.js.map