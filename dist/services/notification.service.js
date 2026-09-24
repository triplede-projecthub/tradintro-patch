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
    /**
     * The viewer's level (user.tree_level holds level_position; 1 = L1). Unknown -> L1.
     */
    async getViewerLevel(userId) {
        var _a, _b;
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
            include: [{ relation: 'userLevel' }]
        });
        return (_b = (_a = user === null || user === void 0 ? void 0 : user.userLevel) === null || _a === void 0 ? void 0 : _a.level_position) !== null && _b !== void 0 ? _b : 1;
    }
    /**
     * Notification visibility - ONE builder feeds both the bell list and the badge count, so the
     * badge can never advertise rows the list then hides (the "count shows but nothing displays"
     * bug: the count used a plain filter while the list ran different SQL).
     *
     * Portfolio/watchlist targeting happens when rows are created (one row per user). Here we only
     * enforce the LEVEL rule for broadcast content, per the notification matrix:
     *  - The user's own activity - type 0 portfolio alert / delist notice, 1 watchlist alert,
     *    2 trade, 4 limit execution/expiry - always shows: it only exists because this user placed the
     *    order / set the alert, and hiding the outcome of their own order would be worse than the
     *    matrix's "NA" (which means L1 cannot place limit orders or set watchlist alerts at all).
     *  - type 3 general news / market holiday (no stock): every level.
     *  - type 3 stock news / watchlist-delist notice: L2 and above (portfolio or watchlist); L1 only
     *    for a stock currently held - L1 has no watchlist, so watchlist-targeted rows are not theirs.
     * Replaces the old list rules, which hid general news + holiday from L1 AND L2
     * (notification_stock_id != 0) and - since the TI24-0120 port - hid everything for stocks the
     * user currently holds (it matched portfolio_status = 1, which is a CLOSED position; the live
     * portfolio is portfolio_status = 0).
     */
    buildNotificationWhere(userId, type, read_status, userLevel) {
        let notificationType = [0, 1];
        let notificationStatus = [0, 1];
        if (type === 'alert') {
            notificationType = [0, 1];
            notificationStatus = [0, 1, 2];
        }
        else if (type === 'news') {
            notificationType = [0, 1, 2, 3, 4];
            notificationStatus = [1, 2];
        }
        let alertPopupStatus = [0, 1];
        if (read_status !== undefined && read_status !== null && read_status !== '' && !isNaN(+read_status)) {
            alertPopupStatus = [+read_status];
        }
        let where = ' n.notification_user_id = ' + (+userId) +
            ' AND n.notification_type IN (' + notificationType.join(',') + ')' +
            ' AND n.notification_status IN (' + notificationStatus.join(',') + ')' +
            ' AND n.alert_popup_status IN (' + alertPopupStatus.join(',') + ')';
        if (userLevel < 2) {
            where += ' AND (n.notification_type <> 3 OR IFNULL(n.notification_stock_id, 0) = 0 OR EXISTS (' +
                'SELECT 1 FROM order_list o WHERE o.order_user_id = n.notification_user_id' +
                ' AND o.order_stock_id = n.notification_stock_id AND o.portfolio_status = 0' +
                ' AND o.order_status = 0 AND o.market_status = 0))';
        }
        return where;
    }
    async countForUser(userId, type, read_status) {
        const userLevel = await this.getViewerLevel(userId);
        const query = 'SELECT COUNT(*) AS count FROM notification n WHERE' +
            this.buildNotificationWhere(userId, type, read_status, userLevel);
        const rows = JSON.parse(JSON.stringify(await this.notificationsRepository.execute(query)));
        return { count: rows && rows.length > 0 ? +rows[0].count : 0 };
    }
    find(userId, type, read_status, search, limit = 10, offset = 0) {
        return new Promise(async (resolve, reject) => {
            try {
                const userLevel = await this.getViewerLevel(userId);
                let searchFilter = '';
                if (search) {
                    // escape quotes/backslashes - the old query concatenated the raw search text
                    const term = String(search).replace(/[\\']/g, (m) => '\\' + m);
                    searchFilter = " AND LOWER(s.stock_name) LIKE LOWER('" + term + "%')";
                }
                const query = 'SELECT n.* FROM notification n' +
                    ' LEFT JOIN stock_list s ON s.stock_id = n.notification_stock_id WHERE' +
                    this.buildNotificationWhere(userId, type, read_status, userLevel) + searchFilter +
                    ' ORDER BY n.notification_execute_date DESC, n.notification_id DESC' +
                    ' LIMIT ' + (+limit || 10) + ' OFFSET ' + (+offset || 0);
                console.log("Notification :> ", query);
                const includeFilter = [
                    {
                        relation: 'history',
                        scope: {
                            limit: 1,
                            order: ['stock_history_date DESC'],
                        }
                    }
                ];
                const result = JSON.parse(JSON.stringify(await this.notificationsRepository.execute(query)));
                for (const item of result) {
                    item.market = await this.marketListRepository.findOne({
                        where: {
                            stock_id: item.notification_stock_id,
                        },
                        include: includeFilter
                    });
                }
                resolve(result);
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
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