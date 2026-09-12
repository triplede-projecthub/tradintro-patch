"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginResponseData = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let LoginResponseData = class LoginResponseData extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], LoginResponseData.prototype, "token", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], LoginResponseData.prototype, "refresh_token", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], LoginResponseData.prototype, "pkiKey", void 0);
LoginResponseData = tslib_1.__decorate([
    (0, repository_1.model)({ settings: { strict: false } }),
    tslib_1.__metadata("design:paramtypes", [Object])
], LoginResponseData);
exports.LoginResponseData = LoginResponseData;
//# sourceMappingURL=login-response-data.model.js.map