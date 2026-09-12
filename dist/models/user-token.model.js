"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserToken = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let UserToken = class UserToken extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", Number)
], UserToken.prototype, "token_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], UserToken.prototype, "token_user_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], UserToken.prototype, "token", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], UserToken.prototype, "device", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], UserToken.prototype, "device_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0, //0 active 1 inactive
    }),
    tslib_1.__metadata("design:type", Number)
], UserToken.prototype, "token_status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date'
    }),
    tslib_1.__metadata("design:type", Date)
], UserToken.prototype, "created_on", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], UserToken.prototype, "updated_on", void 0);
UserToken = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'user_token'
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserToken);
exports.UserToken = UserToken;
//# sourceMappingURL=user-token.model.js.map