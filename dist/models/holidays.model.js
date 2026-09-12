"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Holidays = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Holidays = class Holidays extends repository_1.Entity {
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
], Holidays.prototype, "holiday_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Holidays.prototype, "holiday_day", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Holidays.prototype, "holiday_date", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Holidays.prototype, "holiday_event", void 0);
Holidays = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'holidays',
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Holidays);
exports.Holidays = Holidays;
//# sourceMappingURL=holidays.model.js.map