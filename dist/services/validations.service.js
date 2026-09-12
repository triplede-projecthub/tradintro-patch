"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationsService = exports.Credentials = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const isEmail = tslib_1.__importStar(require("isemail"));
class Credentials {
}
exports.Credentials = Credentials;
let ValidationsService = class ValidationsService {
    constructor() { }
    validateCredentials(credentials) {
        if (credentials.username === undefined || !isEmail.validate(credentials.username)) {
            throw new rest_1.HttpErrors.Unauthorized('invalid username');
        }
        if (credentials.password === undefined || credentials.password.length < 6) {
            throw new rest_1.HttpErrors.Unauthorized('password length should be greater than 8');
        }
        return { username: credentials.username, password: credentials.password };
    }
    isNumber(value) {
        return value > 0;
    }
};
ValidationsService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__metadata("design:paramtypes", [])
], ValidationsService);
exports.ValidationsService = ValidationsService;
//# sourceMappingURL=validations.service.js.map