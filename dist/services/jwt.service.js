"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JWTServiceUtils = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const util_1 = require("util");
const keys_1 = require("../utils/keys");
const jwt = require('jsonwebtoken');
const signAsync = (0, util_1.promisify)(jwt.sign);
const verifyAsync = (0, util_1.promisify)(jwt.verify);
let JWTServiceUtils = class JWTServiceUtils {
    async generateToken(userProfile) {
        if (!userProfile) {
            throw new rest_1.HttpErrors.Unauthorized('Error while generating token :userProfile is null');
        }
        let token = '';
        try {
            token = await signAsync(userProfile, this.apiKeySecret, {
                expiresIn: this.expiresSecret,
            });
            return token;
        }
        catch (err) {
            throw new rest_1.HttpErrors.Unauthorized(`error generating token ${err}`);
        }
    }
    async generateRefreshToken(userProfile) {
        if (!userProfile) {
            throw new rest_1.HttpErrors.Unauthorized('Error while generating token :userProfile is null');
        }
        let refreshToken = '';
        try {
            refreshToken = await signAsync(userProfile, this.refreshKeySecret, {
                expiresIn: this.refreshExpiresSecret,
            });
            return refreshToken;
        }
        catch (err) {
            throw new rest_1.HttpErrors.Unauthorized(`error generating token ${err}`);
        }
    }
    getOption(ignoreExp) {
        if (!ignoreExp) {
            return {
                expiresIn: this.expiresSecret,
            };
        }
        else {
            return {
            //ignore max exp time secret
            };
        }
    }
    async verifyToken(token) {
        if (!token) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying api token:'token' is null`);
        }
        let userProfile;
        try {
            const decryptedToken = await verifyAsync(token, this.apiKeySecret);
            userProfile = Object.assign({ [security_1.securityId]: '', clientId: '', moduleId: '', channel: '' }, {
                [security_1.securityId]: decryptedToken.id,
                id: decryptedToken.id,
                clientId: decryptedToken.clientId,
                moduleId: decryptedToken.moduleId,
                channel: decryptedToken.channel,
            });
            if (userProfile.clientId.length === 0) {
                throw new rest_1.HttpErrors.Unauthorized();
            }
        }
        catch (err) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying api token:${err.message}`);
        }
        return userProfile;
    }
    parseJwt(token) {
        var base64Payload = token.split('.')[1];
        var payload = Buffer.from(base64Payload, 'base64');
        return JSON.parse(payload.toString());
    }
    async verifyRefreshToken(token) {
        if (!token) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying api token:'token' is null`);
        }
        let userProfile;
        try {
            const decryptedToken = await verifyAsync(token, this.refreshKeySecret);
            userProfile = Object.assign({ [security_1.securityId]: '', id: '', clientId: '', moduleId: '', channel: '' }, {
                [security_1.securityId]: decryptedToken.id,
                id: decryptedToken.id,
                clientId: decryptedToken.clientId,
                moduleId: decryptedToken.moduleId,
                channel: decryptedToken.channel,
            });
            if (!userProfile.clientId) {
                userProfile.clientId = userProfile.id;
            }
            if (userProfile.clientId.length === 0) {
                throw new rest_1.HttpErrors.Unauthorized();
            }
        }
        catch (err) {
            throw new rest_1.HttpErrors.Unauthorized(`Error verifying api token:${err.message}`);
        }
        return userProfile;
    }
    createTokenProfile(info) {
        return {
            [security_1.securityId]: info.id,
            id: info.id,
            clientId: info.clientId,
            moduleId: info.moduleId,
            channel: info.channel,
        };
    }
};
tslib_1.__decorate([
    (0, core_1.inject)(keys_1.TokenServiceBindings.API_KEY_SECRET),
    tslib_1.__metadata("design:type", String)
], JWTServiceUtils.prototype, "apiKeySecret", void 0);
tslib_1.__decorate([
    (0, core_1.inject)(keys_1.TokenServiceBindings.API_TOKEN_EXPIRES_IN),
    tslib_1.__metadata("design:type", String)
], JWTServiceUtils.prototype, "expiresSecret", void 0);
tslib_1.__decorate([
    (0, core_1.inject)(keys_1.TokenServiceBindings.REFRESH_TOKEN_SECRET),
    tslib_1.__metadata("design:type", String)
], JWTServiceUtils.prototype, "refreshKeySecret", void 0);
tslib_1.__decorate([
    (0, core_1.inject)(keys_1.TokenServiceBindings.REFRESH_TOKEN_EXPIRES_IN),
    tslib_1.__metadata("design:type", String)
], JWTServiceUtils.prototype, "refreshExpiresSecret", void 0);
JWTServiceUtils = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT })
], JWTServiceUtils);
exports.JWTServiceUtils = JWTServiceUtils;
//# sourceMappingURL=jwt.service.js.map