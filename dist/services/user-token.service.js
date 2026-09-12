"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokenService = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/naming-convention */
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const repositories_1 = require("../repositories");
let UserTokenService = class UserTokenService {
    constructor(userTokenRepository) {
        this.userTokenRepository = userTokenRepository;
    }
    deleteAllUserTokens(userId) {
        return this.userTokenRepository.deleteAll({
            token_user_id: userId
        });
    }
    updateUserFcmToken(userId, fcmTokenChangeRequest) {
        if (!userId || userId == undefined) {
            throw (new rest_1.HttpErrors.BadRequest());
        }
        return new Promise(async (resolve, reject) => {
            try {
                const existing = await this.userTokenRepository.updateAll({
                    token: fcmTokenChangeRequest.fcmToken,
                    token_status: 0,
                    updated_on: this._convertUTCDateToLocalDate(new Date()),
                }, {
                    token_user_id: userId,
                    device_id: fcmTokenChangeRequest.deviceId,
                    device: fcmTokenChangeRequest.device
                });
                if (existing.count == 0) {
                    await this.userTokenRepository.create({
                        token_user_id: userId,
                        device_id: fcmTokenChangeRequest.deviceId,
                        device: fcmTokenChangeRequest.device,
                        created_on: this._convertUTCDateToLocalDate(new Date()),
                        token: fcmTokenChangeRequest.fcmToken,
                        token_status: 0,
                        updated_on: this._convertUTCDateToLocalDate(new Date()),
                    });
                }
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    _convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }
    deleteUserFcmToken(userId, fcmTokenChangeRequest) {
        if (!userId || userId === undefined) {
            throw (new rest_1.HttpErrors.BadRequest());
        }
        return new Promise(async (resolve, reject) => {
            try {
                await this.userTokenRepository.deleteAll({
                    token_user_id: userId,
                    device_id: fcmTokenChangeRequest.deviceId,
                    device: fcmTokenChangeRequest.device
                });
                resolve(true);
            }
            catch (err) {
                reject(err);
            }
        });
    }
};
UserTokenService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.UserTokenRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserTokenRepository])
], UserTokenService);
exports.UserTokenService = UserTokenService;
//# sourceMappingURL=user-token.service.js.map