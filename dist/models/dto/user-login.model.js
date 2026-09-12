"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLogin = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let UserLogin = class UserLogin extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], UserLogin.prototype, "username", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], UserLogin.prototype, "password", void 0);
UserLogin = tslib_1.__decorate([
    (0, repository_1.model)({ settings: { strict: false } }),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserLogin);
exports.UserLogin = UserLogin;
//# sourceMappingURL=user-login.model.js.map