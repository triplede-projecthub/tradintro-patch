"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Market = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
const indices_model_1 = require("./indices.model");
const market_history_model_1 = require("./market-history.model");
const notifications_model_1 = require("./notifications.model");
const portfolio_item_model_1 = require("./portfolio-item.model");
const stock_info_model_1 = require("./stock-info.model");
const watch_list_model_1 = require("./watch-list.model");
let Market = class Market extends repository_1.Entity {
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
], Market.prototype, "stock_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Market.prototype, "stock_code", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Market.prototype, "stock_name", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Market.prototype, "stock_api_code", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Market.prototype, "stock_type", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Market.prototype, "stock_margin", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Market.prototype, "stock_indices_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Market.prototype, "status", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => market_history_model_1.MarketHistory, { keyTo: 'stock_history_code', keyFrom: 'stock_api_code', name: 'history' }),
    tslib_1.__metadata("design:type", Array)
], Market.prototype, "history", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => watch_list_model_1.WatchList, { keyTo: 'watchlist_stock_id', keyFrom: 'stock_id', name: 'watchlist' }),
    tslib_1.__metadata("design:type", watch_list_model_1.WatchList)
], Market.prototype, "watchlist", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => stock_info_model_1.StockInfo, { keyTo: 'stock_name_short', keyFrom: 'stock_code', name: 'stockInfo' }),
    tslib_1.__metadata("design:type", stock_info_model_1.StockInfo)
], Market.prototype, "stockInfo", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => indices_model_1.Indices, { keyTo: 'indices_id', keyFrom: 'stock_indices_id', name: 'indices' }),
    tslib_1.__metadata("design:type", indices_model_1.Indices)
], Market.prototype, "indices", void 0);
tslib_1.__decorate([
    (0, repository_1.hasMany)(() => portfolio_item_model_1.PortfolioItem, { keyTo: 'order_stock_id', keyFrom: 'stock_id', name: 'portfolioItems' }),
    tslib_1.__metadata("design:type", Array)
], Market.prototype, "portfolioItems", void 0);
tslib_1.__decorate([
    (0, repository_1.hasOne)(() => notifications_model_1.Notifications, { keyTo: 'notification_stock_id', keyFrom: 'stock_id', name: 'alert' }),
    tslib_1.__metadata("design:type", notifications_model_1.Notifications)
], Market.prototype, "alert", void 0);
Market = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'stock_list'
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Market);
exports.Market = Market;
//# sourceMappingURL=market.model.js.map