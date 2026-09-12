"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshKeyStrategy = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const keys_1 = require("../utils/keys");
const services_1 = require("../services");
class RefreshKeyStrategy {
    constructor() {
        this.name = 'refreshKey';
    }
    async authenticate(request) {
        const token = this.extractCredentials(request);
        const userProfile = await this.jwtService.verifyRefreshToken(token);
        request.__profile__ = userProfile;
        return Promise.resolve(userProfile);
    }
    extractCredentials(request) {
        if (!request.headers['x-refresh-token']) {
            throw new rest_1.HttpErrors.Unauthorized('E111 - Refresh token is missing');
        }
        const authHeaderValue = request.headers['x-refresh-token'];
        if (authHeaderValue.length === 0) {
            throw new rest_1.HttpErrors.Unauthorized(`E112 - Refresh token header  missing`);
        }
        console.log(authHeaderValue);
        return authHeaderValue;
    }
}
tslib_1.__decorate([
    (0, core_1.inject)(keys_1.TokenServiceBindings.TOKEN_SERVICE),
    tslib_1.__metadata("design:type", services_1.JWTServiceUtils)
], RefreshKeyStrategy.prototype, "jwtService", void 0);
exports.RefreshKeyStrategy = RefreshKeyStrategy;
//# sourceMappingURL=refresh-key.strategy.js.map