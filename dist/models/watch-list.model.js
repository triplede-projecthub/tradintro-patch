"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchList = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const market_model_1 = require("./market.model");
const notifications_model_1 = require("./notifications.model");
let WatchList = class WatchList extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        name: 'watchlist_id',
        type: 'number',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", Number)
], WatchList.prototype, "watchlist_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        name: 'watchlist_stock_id',
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], WatchList.prototype, "watchlist_stock_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        name: 'watchlist_user_id',
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], WatchList.prototype, "watchlist_user_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        name: 'watchlist_stock_price',
        type: 'number',
        required: true,
    }),
    tslib_1.__metadata("design:type", Number)
], WatchList.prototype, "watchlist_stock_price", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        name: 'watchlist_date',
        type: 'date',
        required: true,
    }),
    tslib_1.__metadata("design:type", Date)
], WatchList.prototype, "watchlist_date", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => market_model_1.Market, { keyTo: 'stock_id', keyFrom: 'watchlist_stock_id', name: 'market' }),
    tslib_1.__metadata("design:type", market_model_1.Market)
], WatchList.prototype, "market", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => notifications_model_1.Notifications, { keyTo: 'notification_stock_id', keyFrom: 'watchlist_stock_id', name: 'alert' }),
    tslib_1.__metadata("design:type", notifications_model_1.Notifications)
], WatchList.prototype, "alert", void 0);
WatchList = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'watchlist',
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], WatchList);
exports.WatchList = WatchList;
//# sourceMappingURL=watch-list.model.js.map