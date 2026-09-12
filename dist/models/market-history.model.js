"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketHistory = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const market_model_1 = require("./market.model");
let MarketHistory = class MarketHistory extends repository_1.Entity {
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
], MarketHistory.prototype, "stock_history_id", void 0);
tslib_1.__decorate([
    (0, repository_1.belongsTo)(() => market_model_1.Market, { keyTo: 'stock_api_code', name: 'code' }),
    tslib_1.__metadata("design:type", String)
], MarketHistory.prototype, "stock_history_code", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], MarketHistory.prototype, "stock_history_date", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], MarketHistory.prototype, "stock_history_open", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], MarketHistory.prototype, "stock_history_close", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], MarketHistory.prototype, "stock_history_high", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], MarketHistory.prototype, "stock_history_low", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], MarketHistory.prototype, "current_price", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], MarketHistory.prototype, "original_date", void 0);
MarketHistory = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'stock_history',
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], MarketHistory);
exports.MarketHistory = MarketHistory;
//# sourceMappingURL=market-history.model.js.map