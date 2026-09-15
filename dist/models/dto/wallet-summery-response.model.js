"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletSummeryResponse = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let WalletSummeryResponse = class WalletSummeryResponse extends repository_1.Model {
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
], WalletSummeryResponse.prototype, "user_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], WalletSummeryResponse.prototype, "trade_money_balance", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: new Date().toLocaleString(),
    }),
    tslib_1.__metadata("design:type", String)
], WalletSummeryResponse.prototype, "last_allocated_on", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], WalletSummeryResponse.prototype, "last_allocation_amount", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], WalletSummeryResponse.prototype, "available_margin", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], WalletSummeryResponse.prototype, "margin_used", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], WalletSummeryResponse.prototype, "trade_money_usable_balance", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], WalletSummeryResponse.prototype, "trade_money_blocked", void 0);
WalletSummeryResponse = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], WalletSummeryResponse);
exports.WalletSummeryResponse = WalletSummeryResponse;
//# sourceMappingURL=wallet-summery-response.model.js.map