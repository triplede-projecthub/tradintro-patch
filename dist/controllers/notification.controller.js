"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const bulk_notification_read_request_model_1 = require("../models/dto/bulk-notification-read-request.model");
const services_1 = require("../services");
const security_spec_1 = require("../utils/security-spec");
const api_utils_1 = require("./api.utils");
const notifications_dto_1 = require("./dto/notifications.dto");
let NotificationController = class NotificationController {
    constructor(notificationService, user) {
        this.notificationService = notificationService;
        this.user = user;
    }
    async count(read_status, type) {
        // The badge must count exactly what the list shows, so it goes through the same
        // visibility builder as find() (level rules included) instead of a plain filter.
        return new Promise((resolve, reject) => {
            this.notificationService.countForUser(+(this.user.id), type, read_status).then((result) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async find(type, read_status, search, limit = 10, offset = 0) {
        return new Promise((resolve, reject) => {
            var _a;
            this.notificationService.find(+((_a = this.user.id) !== null && _a !== void 0 ? _a : 0), type, read_status, search, limit, offset).then((result) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async findById(id) {
        return new Promise((resolve, reject) => {
            this.notificationService.findById(id, +(this.user.id)).then((result) => {
                if (result == null) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        status: true,
                        statusCode: 204,
                        message: 'OK'
                    }));
                }
                else {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: result,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
            }).catch((error) => reject(error));
        });
    }
    async deleteNotificationForUser(id) {
        return new Promise((resolve, reject) => {
            this.notificationService.deleteNotificationForUser(id, +(this.user.id)).then((count) => {
                if (count && count.count > 0) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: count,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
                else {
                    resolve((0, api_utils_1.generateApiResponse)({
                        status: true,
                        statusCode: 204,
                        message: 'OK'
                    }));
                }
            }).catch((error) => reject(error));
        });
    }
    async deleteAllNotificationForUser() {
        return new Promise((resolve, reject) => {
            this.notificationService.deleteNotificationForUser(-1, +(this.user.id)).then((count) => {
                if (count && count.count > 0) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: count,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
                else {
                    resolve((0, api_utils_1.generateApiResponse)({
                        status: true,
                        statusCode: 204,
                        message: 'OK'
                    }));
                }
            }).catch((error) => reject(error));
        });
    }
    async readNotificationStatusOfUser(id) {
        return new Promise((resolve, reject) => {
            this.notificationService.updateReadStatusOfNotification(id, +(this.user.id)).then((count) => {
                if (count && count.count > 0) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: count,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
                else {
                    resolve((0, api_utils_1.generateApiResponse)({
                        status: true,
                        statusCode: 204,
                        message: 'OK'
                    }));
                }
            }).catch((error) => reject(error));
        });
    }
    async bulkNotificationRead(body) {
        return new Promise((resolve, reject) => {
            this.notificationService.updateReadStatus(+(this.user.id), body.notificationIds).then((loginResult) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: loginResult,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async modifyAlertPrice(id, alertRequest) {
        return new Promise((resolve, reject) => {
            this.notificationService.setAlertForNotification(id, +(this.user.id), alertRequest.amount).then(result => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: result ? 200 : 204,
                    message: 'OK'
                }));
            }).catch(err => { reject(err); });
        });
    }
};
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/notifications/count', {
        description: 'Get total notification count for user.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': notifications_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.number('read_status', {
        optional: true,
        description: '`1` for read notifications and `0` for unread notifications. Ignore for all notifications.'
    })),
    tslib_1.__param(1, rest_1.param.query.string('type', {
        optional: true,
        description: 'Pass `alert` or `news` for filtering.'
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, String]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationController.prototype, "count", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/notifications', {
        description: 'Get list of notification for user.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': notifications_dto_1.NOTIFICATION_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.string('type', {
        optional: true,
        description: 'Pass `alert` or `news` for filtering.'
    })),
    tslib_1.__param(1, rest_1.param.query.number('read_status', {
        optional: true,
        description: '`1` for read notifications and `0` for unread notifications. Ignore for all notifications.'
    })),
    tslib_1.__param(2, rest_1.param.query.string('search', { optional: true })),
    tslib_1.__param(3, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(4, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String, Number, String, Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationController.prototype, "find", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/notifications/{id}', {
        description: 'Get notification details by ID (notification_id) of User.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': notifications_dto_1.NOTIFICATION_BY_ID_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationController.prototype, "findById", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.del)('/notifications/{id}', {
        description: 'Delete notification for user by ID (notification_id).',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': notifications_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteNotificationForUser", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.del)('/notifications/all', {
        description: 'Delete all notification for user',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': notifications_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationController.prototype, "deleteAllNotificationForUser", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.patch)('/notifications/read/{id}', {
        description: 'Update notification read status of user',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': notifications_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.string('id', {
        description: 'id of notification to be updated or \
      pass `all` to update status of all notification. ',
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [String]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationController.prototype, "readNotificationStatusOfUser", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/notifications/read', {
        description: 'Change read status of notifications.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': notifications_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(bulk_notification_read_request_model_1.BulkNotificationReadRequest),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [bulk_notification_read_request_model_1.BulkNotificationReadRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationController.prototype, "bulkNotificationRead", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/notifications/{id}/alert', {
        description: 'Modify price of a notification (Alert).',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': notifications_dto_1.NOTIFICATION_BY_ID_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.path.number('id')),
    tslib_1.__param(1, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: {
                    type: 'object',
                    title: 'AlertRequest',
                    properties: {
                        amount: { type: 'number' },
                    }
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Number, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationController.prototype, "modifyAlertPrice", null);
NotificationController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(services_1.NotificationService)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [services_1.NotificationService, Object])
], NotificationController);
exports.NotificationController = NotificationController;
//# sourceMappingURL=notification.controller.js.map