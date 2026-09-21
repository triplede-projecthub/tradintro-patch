"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationService = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable no-async-promise-executor */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-explicit-any */
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const models_1 = require("../models");
const repositories_1 = require("../repositories");
const util_service_1 = require("./util.service");
let NotificationService = class NotificationService {
    constructor(notificationsRepository, marketListRepository, userRepository, utilService, portfolioRepository, watchListRepository) {
        this.notificationsRepository = notificationsRepository;
        this.marketListRepository = marketListRepository;
        this.userRepository = userRepository;
        this.utilService = utilService;
        this.portfolioRepository = portfolioRepository;
        this.watchListRepository = watchListRepository;
    }
    /**
     * TI24-0120-001 (sc.2): the stock ids the user currently holds plus everything on their
     * watchlist. Stock-specific admin news belongs in the bell icon only for these; news for any
     * other stock still appears under that stock's own News section. A live current holding is
     * portfolio_status = 1 with order_status = 0 and market_status = 0 (the enum labels 1 as
     * OLD_HOLDING, but the data uses it for the active position - carried over from the v1.1.0 fix).
     */
    async findFollowedStockIds(userId) {
        const [holdings, watched] = await Promise.all([
            this.portfolioRepository.find({
                where: {
                    order_user_id: userId,
                    portfolio_status: 1,
                    order_status: 0,
                    market_status: 0,
                },
                fields: { order_stock_id: true },
            }),
            this.watchListRepository.find({
                where: { watchlist_user_id: userId },
                fields: { watchlist_stock_id: true },
            }),
        ]);
        const ids = new Set();
        for (const h of holdings)
            if (h.order_stock_id)
                ids.add(+h.order_stock_id);
        for (const w of watched)
            if (w.watchlist_stock_id)
                ids.add(+w.watchlist_stock_id);
        return [...ids];
    }
    updateReadStatusOfNotification(id, userId) {
        return this.notificationsRepository.updateAll({
            alert_popup_status: 1
        }, {
            notification_id: id === 'all' ? undefined : +(id),
            notification_user_id: userId,
            notification_status: 1
        });
    }
    deleteNotificationForUser(id, userId) {
        return this.notificationsRepository.deleteAll({
            notification_id: id == -1 ? undefined : id,
            notification_user_id: userId
        });
    }
    async findById(id, userId) {
        const notification = await this.notificationsRepository.findOne({
            where: { notification_id: id, notification_user_id: userId },
            include: [
                {
                    relation: 'market',
                    scope: {
                        include: [{
                                relation: 'history',
                                scope: {
                                    limit: 1,
                                    order: ['stock_history_date DESC']
                                }
                            }]
                    }
                }
            ]
        });
        /*  if (notification && notification.market) {
           await this.utilService.handleMarketHistory(notification.market);
         } */
        return notification;
    }
    async count(where) {
        return this.notificationsRepository.count(where);
    }
    find(userId, type, read_status, search, limit = 10, offset = 0) {
        return new Promise(async (resolve, reject) => {
            var _a, _b;
            const user = await this.userRepository.findOne({
                where: {
                    user_id: userId
                },
                include: [{
                        relation: 'userLevel'
                    }]
            });
            const currentUserLevel = (_b = (_a = user === null || user === void 0 ? void 0 : user.userLevel) === null || _a === void 0 ? void 0 : _a.level_position) !== null && _b !== void 0 ? _b : 1;
            let notificationType = [0, 1];
            let notificationStatus = [0, 1];
            let stockFilterId = 0;
            if (type) {
                switch (type) {
                    case 'alert':
                        notificationType = [0, 1];
                        notificationStatus = [0, 1, 2];
                        stockFilterId = -1000;
                        break;
                    case 'news':
                        notificationType = [0, 1, 2, 3, 4];
                        notificationStatus = [1, 2];
                        break;
                }
            }
            //const groupBy = " GROUP BY order_list.order_stock_id ";
            let alertPopupStatus = [0, 1];
            if (read_status) {
                alertPopupStatus = [read_status];
            }
            // TI24-0120-001 (sc.2): restrict the news list to stock-specific notifications for
            // stocks the user holds or watches. General/no-stock news is untouched (it comes through
            // the UNION), and the alert tab is untouched (alerts are for stocks the user follows).
            // A follower of nothing gets no stock-specific news (IN (-1) matches no stock).
            let followedStockFilter = '';
            if (type === 'news') {
                const followedStockIds = await this.findFollowedStockIds(userId);
                followedStockFilter = followedStockIds.length > 0
                    ? ' AND notification.notification_stock_id IN (' + followedStockIds.join(',') + ') '
                    : ' AND notification.notification_stock_id IN (-1) ';
            }
            const query = this.generateNotificationQuery(notificationType, notificationStatus, alertPopupStatus, userId, offset, limit, currentUserLevel, search, stockFilterId, followedStockFilter);
            const includeFilter = [
                {
                    relation: 'history',
                    scope: {
                        limit: 1,
                        order: ['stock_history_date DESC'],
                    }
                }
            ];
            console.log("Notification :> ", query);
            this.notificationsRepository.execute(query).then(async (result) => {
                result = JSON.parse(JSON.stringify(result));
                for await (const item of result) {
                    item.market = await this.marketListRepository.findOne({
                        where: {
                            stock_id: item.notification_stock_id,
                        },
                        include: includeFilter
                    });
                    // await this.utilService.handleMarketHistory((item as any).market)
                }
                console.log("result end");
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
    generateNotificationQuery(notification_type, notification_status, alert_popup_status, notification_user_id, offset = 0, limit = 10, userLevel = 1, searchQuery, stockId = 0, followedStockFilter = '') {
        // Convert arrays to comma-separated strings for SQL IN clauses
        const notificationTypeStr = notification_type.join(',');
        const notificationStatusStr = notification_status.join(',');
        const alertPopupStatusStr = alert_popup_status.join(',');
        let levelWiseFilter = ' AND notification.notification_stock_id != 0 ';
        if (userLevel > 2) {
            levelWiseFilter = '';
        }
        else {
            stockId = -1000;
        }
        let searchFilter = '';
        if (searchQuery) {
            searchFilter = " AND LOWER(stock_list.stock_name) LIKE LOWER('" + searchQuery + "%') ";
            stockId = -1000;
        }
        const query = `
      SELECT notification.*
      FROM notification
      RIGHT JOIN stock_list ON notification.notification_stock_id = stock_list.stock_id
      WHERE notification.notification_type IN (${notificationTypeStr})
            AND notification.notification_status IN (${notificationStatusStr})
            AND notification.alert_popup_status IN (${alertPopupStatusStr})
            AND notification.notification_user_id=${notification_user_id}
            ${levelWiseFilter} ${searchFilter} ${followedStockFilter}
            AND notification.notification_id IS NOT NULL

      UNION

      SELECT *
      FROM notification
      WHERE notification_stock_id=${stockId} AND notification_user_id =${notification_user_id}
      GROUP BY notification_news_id

      ORDER BY notification_execute_date DESC
      LIMIT ${limit} OFFSET ${offset};
    `;
        return query;
    }
    updateReadStatus(userId, notificationIds) {
        return this.notificationsRepository.updateAll({
            alert_popup_status: 1
        }, {
            notification_user_id: userId,
            notification_id: {
                inq: notificationIds
            },
            alert_popup_status: 0
        });
    }
    async setAlertForNotification(notificationId, userId, amount) {
        const activeNotification = await this.notificationsRepository.findOne({
            where: {
                notification_user_id: userId,
                notification_id: notificationId,
                notification_type: {
                    inq: [1, 0]
                },
                notification_status: 0
            }
        });
        if (activeNotification) {
            //modify
            activeNotification.notification_price = amount;
            activeNotification.notification_execute_date = this._convertUTCDateToLocalDate(new Date()),
                activeNotification.notification_start_date = this._convertUTCDateToLocalDate(new Date()),
                await this.notificationsRepository.updateById(activeNotification.notification_id, {
                    notification_price: amount,
                    notification_execute_date: this._convertUTCDateToLocalDate(new Date()),
                    notification_start_date: this._convertUTCDateToLocalDate(new Date()),
                });
            return activeNotification;
        }
        else {
            throw (new rest_1.HttpErrors.BadRequest("Alert not found"));
        }
    }
    _convertUTCDateToLocalDate(date) {
        const newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }
};
tslib_1.__decorate([
    tslib_1.__param(0, rest_1.param.where(models_1.Notifications)),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], NotificationService.prototype, "count", null);
NotificationService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.NotificationsRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.MarketRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.UserRepository)),
    tslib_1.__param(3, (0, core_1.service)(util_service_1.UtilService)),
    tslib_1.__param(4, (0, repository_1.repository)(repositories_1.PortfolioItemRepository)),
    tslib_1.__param(5, (0, repository_1.repository)(repositories_1.WatchListRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.NotificationsRepository,
        repositories_1.MarketRepository,
        repositories_1.UserRepository,
        util_service_1.UtilService,
        repositories_1.PortfolioItemRepository,
        repositories_1.WatchListRepository])
], NotificationService);
exports.NotificationService = NotificationService;
//# sourceMappingURL=notification.service.js.map