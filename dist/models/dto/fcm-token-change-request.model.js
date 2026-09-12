"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FcmTokenChangeRequest = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let FcmTokenChangeRequest = class FcmTokenChangeRequest extends repository_1.Model {
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
], FcmTokenChangeRequest.prototype, "fcmToken", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], FcmTokenChangeRequest.prototype, "deviceId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], FcmTokenChangeRequest.prototype, "device", void 0);
FcmTokenChangeRequest = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], FcmTokenChangeRequest);
exports.FcmTokenChangeRequest = FcmTokenChangeRequest;
//# sourceMappingURL=fcm-token-change-request.model.js.map