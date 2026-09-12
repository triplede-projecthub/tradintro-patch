"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestLog = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let RequestLog = class RequestLog extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        default: new Date(),
    }),
    tslib_1.__metadata("design:type", String)
], RequestLog.prototype, "timestamp", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], RequestLog.prototype, "httpStatus", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], RequestLog.prototype, "headers", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        id: true,
        generated: false,
    }),
    tslib_1.__metadata("design:type", String)
], RequestLog.prototype, "requestId", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], RequestLog.prototype, "httpStatusMsg", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], RequestLog.prototype, "profileId", void 0);
RequestLog = tslib_1.__decorate([
    (0, repository_1.model)({ settings: { strict: false } }),
    tslib_1.__metadata("design:paramtypes", [Object])
], RequestLog);
exports.RequestLog = RequestLog;
//# sourceMappingURL=request-log.model.js.map