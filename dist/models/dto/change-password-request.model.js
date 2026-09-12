"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePasswordRequest = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let ChangePasswordRequest = class ChangePasswordRequest extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], ChangePasswordRequest.prototype, "currentPassword", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], ChangePasswordRequest.prototype, "newPassword", void 0);
ChangePasswordRequest = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], ChangePasswordRequest);
exports.ChangePasswordRequest = ChangePasswordRequest;
//# sourceMappingURL=change-password-request.model.js.map