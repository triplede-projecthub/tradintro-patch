"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiKeyStrategy = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../utils/keys");
const services_1 = require("../services");
class ApiKeyStrategy {
    constructor() {
        this.name = 'apiKey';
    }
    async authenticate(request) {
        const token = this.extractCredentials(request);
        const userProfile = await this.jwtService.verifyToken(token);
        request.__profile__ = userProfile;
        return Promise.resolve(userProfile);
    }
    extractCredentials(request) {
        if (!request.headers.authorization) {
            throw new rest_1.HttpErrors.Unauthorized('E401 - Authorization is missing');
        }
        const authHeaderValue = request.headers.authorization;
        // authorization : Bearer xxxx.yyyy.zzzz
        if (!authHeaderValue.startsWith('Bearer ')) {
            throw new rest_1.HttpErrors.Unauthorized('E402 - Authorization header is not type of Bearer');
        }
        const parts = authHeaderValue.split(' ');
        if (parts.length !== 2) {
            throw new rest_1.HttpErrors.Unauthorized(`E403 - Authorization header has too many part is must follow this patter 'Bearer xx.yy.zz`);
        }
        const token = parts[1];
        return token;
    }
}
tslib_1.__decorate([
    (0, core_1.inject)(keys_1.TokenServiceBindings.TOKEN_SERVICE),
    tslib_1.__metadata("design:type", services_1.JWTServiceUtils)
], ApiKeyStrategy.prototype, "jwtService", void 0);
exports.ApiKeyStrategy = ApiKeyStrategy;
//# sourceMappingURL=api-key.strategy.js.map