"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitLossSummery = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let ProfitLossSummery = class ProfitLossSummery extends repository_1.Model {
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
], ProfitLossSummery.prototype, "realizedProfitLossValue", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], ProfitLossSummery.prototype, "realizedProfitLossValuePercentage", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], ProfitLossSummery.prototype, "unRealizedProfitLossValue", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], ProfitLossSummery.prototype, "unRealizedProfitLossValuePercentage", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], ProfitLossSummery.prototype, "totalInvestmentValue", void 0);
ProfitLossSummery = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ProfitLossSummery);
exports.ProfitLossSummery = ProfitLossSummery;
//# sourceMappingURL=profit-loss-summery.model.js.map