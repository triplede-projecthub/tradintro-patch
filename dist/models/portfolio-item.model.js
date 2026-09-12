"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioItem = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const market_model_1 = require("./market.model");
const notifications_model_1 = require("./notifications.model");
let PortfolioItem = class PortfolioItem extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_stock_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_user_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], PortfolioItem.prototype, "order_no", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_price", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "total_stock_value", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "brokerage", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "transaction_charge", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_total", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "margin_amount_used", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "margin_status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 1,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_qty", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: new Date()
    }),
    tslib_1.__metadata("design:type", Date)
], PortfolioItem.prototype, "order_createdon", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: new Date()
    }),
    tslib_1.__metadata("design:type", Date)
], PortfolioItem.prototype, "order_executed_on", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_execution_type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "market_status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "portfolio_status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_validity", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: new Date()
    }),
    tslib_1.__metadata("design:type", Date)
], PortfolioItem.prototype, "order_validity_date", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], PortfolioItem.prototype, "order_email_status", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => market_model_1.Market, { keyTo: 'stock_id', keyFrom: 'order_stock_id', name: 'market' }),
    tslib_1.__metadata("design:type", market_model_1.Market)
], PortfolioItem.prototype, "market", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => notifications_model_1.Notifications, { keyTo: 'notification_stock_id', keyFrom: 'order_stock_id', name: 'alert' }),
    tslib_1.__metadata("design:type", notifications_model_1.Notifications)
], PortfolioItem.prototype, "alert", void 0);
PortfolioItem = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'order_list'
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], PortfolioItem);
exports.PortfolioItem = PortfolioItem;
//# sourceMappingURL=portfolio-item.model.js.map