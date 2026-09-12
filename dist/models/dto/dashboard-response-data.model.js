"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardResponseData = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let DashboardResponseData = class DashboardResponseData extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], DashboardResponseData.prototype, "current_points", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", String)
], DashboardResponseData.prototype, "last_login", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 1,
    }),
    tslib_1.__metadata("design:type", Number)
], DashboardResponseData.prototype, "user_level", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], DashboardResponseData.prototype, "level_badge_image", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], DashboardResponseData.prototype, "user_name", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        id: true,
        generated: false,
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], DashboardResponseData.prototype, "user_id", void 0);
DashboardResponseData = tslib_1.__decorate([
    (0, repository_1.model)(),
    tslib_1.__metadata("design:paramtypes", [Object])
], DashboardResponseData);
exports.DashboardResponseData = DashboardResponseData;
//# sourceMappingURL=dashboard-response-data.model.js.map