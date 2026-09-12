"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevelsResponse = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let UserLevelsResponse = class UserLevelsResponse extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], UserLevelsResponse.prototype, "myLevel", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], UserLevelsResponse.prototype, "myPoints", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'object',
        required: true,
    }),
    tslib_1.__metadata("design:type", Array)
], UserLevelsResponse.prototype, "levels", void 0);
UserLevelsResponse = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], UserLevelsResponse);
exports.UserLevelsResponse = UserLevelsResponse;
//# sourceMappingURL=user-levels-response.model.js.map