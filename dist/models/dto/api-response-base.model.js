"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiResponse = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let ApiResponse = class ApiResponse extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'boolean',
        default: false,
    }),
    tslib_1.__metadata("design:type", Boolean)
], ApiResponse.prototype, "status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
    }),
    tslib_1.__metadata("design:type", Number)
], ApiResponse.prototype, "statusCode", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'object',
    }),
    tslib_1.__metadata("design:type", Object)
], ApiResponse.prototype, "data", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], ApiResponse.prototype, "message", void 0);
ApiResponse = tslib_1.__decorate([
    (0, repository_1.model)({ settings: { strict: false } }),
    tslib_1.__metadata("design:paramtypes", [Object])
], ApiResponse);
exports.ApiResponse = ApiResponse;
//# sourceMappingURL=api-response-base.model.js.map