"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioDashboardResponse = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let PortfolioDashboardResponse = class PortfolioDashboardResponse extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "holding_value", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "holding_value_diff", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "holding_value_diff_percentage", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "trade_money_balance", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "total_trade_money", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "total_investment", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "user_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "total_portfolio_qty", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "usedMargin", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioDashboardResponse.prototype, "tradeMoneyUsed", void 0);
PortfolioDashboardResponse = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], PortfolioDashboardResponse);
exports.PortfolioDashboardResponse = PortfolioDashboardResponse;
//# sourceMappingURL=portfolio-dashboard-response.model.js.map