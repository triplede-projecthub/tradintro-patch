"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tax = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Tax = class Tax extends repository_1.Entity {
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
], Tax.prototype, "tax_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Tax.prototype, "tax_name", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Tax.prototype, "tax_value", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Tax.prototype, "tax_status", void 0);
Tax = tslib_1.__decorate([
    (0, repository_1.model)({ name: 'tax' }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Tax);
exports.Tax = Tax;
//# sourceMappingURL=tax.model.js.map