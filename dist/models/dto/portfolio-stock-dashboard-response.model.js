"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioStockDashboardResponse = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let PortfolioStockDashboardResponse = class PortfolioStockDashboardResponse extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], PortfolioStockDashboardResponse.prototype, "portfolioId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], PortfolioStockDashboardResponse.prototype, "stockId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], PortfolioStockDashboardResponse.prototype, "stockName", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], PortfolioStockDashboardResponse.prototype, "stockApiCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], PortfolioStockDashboardResponse.prototype, "stockCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioStockDashboardResponse.prototype, "currentPrice", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioStockDashboardResponse.prototype, "avgPurchasePrice", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioStockDashboardResponse.prototype, "qty", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioStockDashboardResponse.prototype, "totalPrice", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioStockDashboardResponse.prototype, "totalValue", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioStockDashboardResponse.prototype, "alertPrice", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioStockDashboardResponse.prototype, "gainLossValue", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioStockDashboardResponse.prototype, "gainLossPercentage", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioStockDashboardResponse.prototype, "user_id", void 0);
PortfolioStockDashboardResponse = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], PortfolioStockDashboardResponse);
exports.PortfolioStockDashboardResponse = PortfolioStockDashboardResponse;
//# sourceMappingURL=portfolio-stock-dashboard-response.model.js.map