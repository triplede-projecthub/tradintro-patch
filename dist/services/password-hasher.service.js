"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BCryptPasswordHasherService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const keys_1 = require("../utils/keys");
const bcryptjs_1 = require("bcryptjs");
let BCryptPasswordHasherService = class BCryptPasswordHasherService {
    async comparePassword(providedPass, storedPass) {
        const passwordMatches = await (0, bcryptjs_1.compare)(providedPass, storedPass);
        return passwordMatches;
    }
    async hashPassword(password) {
        const salt = await (0, bcryptjs_1.genSalt)(this.rounds);
        return (0, bcryptjs_1.hash)(password, salt);
    }
};
tslib_1.__decorate([
    (0, core_1.inject)(keys_1.PasswordHasherBindings.ROUNDS),
    tslib_1.__metadata("design:type", Number)
], BCryptPasswordHasherService.prototype, "rounds", void 0);
BCryptPasswordHasherService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON })
], BCryptPasswordHasherService);
exports.BCryptPasswordHasherService = BCryptPasswordHasherService;
//# sourceMappingURL=password-hasher.service.js.map