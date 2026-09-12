"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BulkNotificationReadRequest = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let BulkNotificationReadRequest = class BulkNotificationReadRequest extends repository_1.Model {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'array',
        itemType: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Array)
], BulkNotificationReadRequest.prototype, "notificationIds", void 0);
BulkNotificationReadRequest = tslib_1.__decorate([
    (0, repository_1.model)({ settings: { strict: false } }),
    tslib_1.__metadata("design:paramtypes", [Object])
], BulkNotificationReadRequest);
exports.BulkNotificationReadRequest = BulkNotificationReadRequest;
//# sourceMappingURL=bulk-notification-read-request.model.js.map