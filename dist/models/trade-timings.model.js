"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradeTimings = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let TradeTimings = class TradeTimings extends repository_1.Entity {
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
], TradeTimings.prototype, "time_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], TradeTimings.prototype, "time_open", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], TradeTimings.prototype, "time_close", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], TradeTimings.prototype, "time_day", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 1,
    }),
    tslib_1.__metadata("design:type", Number)
], TradeTimings.prototype, "day_status", void 0);
TradeTimings = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'trade_time'
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], TradeTimings);
exports.TradeTimings = TradeTimings;
//# sourceMappingURL=trade-timings.model.js.map