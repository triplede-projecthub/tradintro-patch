"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Voucher = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Voucher = class Voucher extends repository_1.Entity {
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
], Voucher.prototype, "voucher_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Voucher.prototype, "voucher_code", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Voucher.prototype, "voucher_user_type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Voucher.prototype, "voucher_amount", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Voucher.prototype, "voucher_valid_from", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Voucher.prototype, "voucher_valid_to", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Voucher.prototype, "voucher_type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Voucher.prototype, "voucher_remarks", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], Voucher.prototype, "voucher_created_on", void 0);
Voucher = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'voucher'
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Voucher);
exports.Voucher = Voucher;
//# sourceMappingURL=voucher.model.js.map