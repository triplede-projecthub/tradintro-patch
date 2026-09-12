"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserInvite = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let UserInvite = class UserInvite extends repository_1.Entity {
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
], UserInvite.prototype, "invite_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], UserInvite.prototype, "invite_from", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], UserInvite.prototype, "invite_from_member", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], UserInvite.prototype, "invite_to", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], UserInvite.prototype, "invite_email", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], UserInvite.prototype, "invite_status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], UserInvite.prototype, "invite_email_status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", Date)
], UserInvite.prototype, "invite_date", void 0);
UserInvite = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'customer_invite'
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserInvite);
exports.UserInvite = UserInvite;
//# sourceMappingURL=user-invite.model.js.map