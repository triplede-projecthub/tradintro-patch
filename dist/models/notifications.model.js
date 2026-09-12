"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notifications = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const market_model_1 = require("./market.model");
let Notifications = class Notifications extends repository_1.Entity {
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
], Notifications.prototype, "notification_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Notifications.prototype, "notification_news_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Notifications.prototype, "notification_user_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Notifications.prototype, "notification_user_type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Notifications.prototype, "notification_price", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Notifications.prototype, "notification_heading", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
    }),
    tslib_1.__metadata("design:type", String)
], Notifications.prototype, "notification_text", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Notifications.prototype, "notification_stock_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Notifications.prototype, "notification_type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Notifications.prototype, "notification_start_date", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Notifications.prototype, "notification_execute_date", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], Notifications.prototype, "notification_shedule_date", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        required: true,
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Notifications.prototype, "notification_status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Notifications.prototype, "alert_popup_status", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Notifications.prototype, "firebase_send_status", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => market_model_1.Market, { keyTo: 'stock_id', keyFrom: 'notification_stock_id', name: 'market' }),
    tslib_1.__metadata("design:type", market_model_1.Market)
], Notifications.prototype, "market", void 0);
Notifications = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'notification'
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Notifications);
exports.Notifications = Notifications;
//# sourceMappingURL=notifications.model.js.map