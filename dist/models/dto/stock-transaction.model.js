"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockTransaction = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const constants_1 = require("../../utils/constants");
let StockTransaction = class StockTransaction extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], StockTransaction.prototype, "order_qty", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], StockTransaction.prototype, "order_execution_type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], StockTransaction.prototype, "stock_code", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], StockTransaction.prototype, "order_validity", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: constants_1.MarketFlags.PRODUCT_TYPE.HOLDING,
    }),
    tslib_1.__metadata("design:type", Number)
], StockTransaction.prototype, "product_type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], StockTransaction.prototype, "alert_price", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], StockTransaction.prototype, "order_validity_date", void 0);
StockTransaction = tslib_1.__decorate([
    (0, repository_1.model)({ settings: { strict: false } }),
    tslib_1.__metadata("design:paramtypes", [Object])
], StockTransaction);
exports.StockTransaction = StockTransaction;
//# sourceMappingURL=stock-transaction.model.js.map