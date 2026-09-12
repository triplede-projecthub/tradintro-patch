"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeletedUsers = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let DeletedUsers = class DeletedUsers extends repository_1.Entity {
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
], DeletedUsers.prototype, "id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], DeletedUsers.prototype, "delete_user_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], DeletedUsers.prototype, "delete_user_name", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], DeletedUsers.prototype, "delete_user_email", void 0);
DeletedUsers = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'deleted_records',
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], DeletedUsers);
exports.DeletedUsers = DeletedUsers;
//# sourceMappingURL=deleted_user.model.js.map