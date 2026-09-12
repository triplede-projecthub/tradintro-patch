"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WatchListService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const repositories_1 = require("../repositories");
const constants_1 = require("../utils/constants");
const user_points_service_1 = require("./user-points.service");
const util_service_1 = require("./util.service");
let WatchListService = class WatchListService {
    constructor(watchListRepository, marketListRepository, notificationsRepository, utilService, userPointsService, userRepository) {
        this.watchListRepository = watchListRepository;
        this.marketListRepository = marketListRepository;
        this.notificationsRepository = notificationsRepository;
        this.utilService = utilService;
        this.userPointsService = userPointsService;
        this.userRepository = userRepository;
    }
    async create(watchList, userId) {
        watchList.watchlist_user_id = userId;
        watchList.watchlist_date = this._convertUTCDateToLocalDate(new Date());
        console.log(watchList);
        const data = await this.watchListRepository.create(watchList);
        this.handleWatchListPoint(userId).then(() => {
            console.log("WatchList Point Update");
        }).catch((error) => {
            console.log("WatchList Point Update", error);
        });
        return data;
    }
    async handleWatchListPoint(userId) {
        var _a, _b;
        const user = await this.userRepository.findOne({
            where: {
                user_id: userId,
                user_status: {
                    inq: [0, 1]
                }
            },
            include: [{
                    relation: 'userLevel'
                }]
        });
        if (user) {
            const currentUserLevel = (_b = (_a = user === null || user === void 0 ? void 0 : user.userLevel) === null || _a === void 0 ? void 0 : _a.level_position) !== null && _b !== void 0 ? _b : 1;
            if (currentUserLevel > 1)
                this.userPointsService.handleUserPoint(userId, constants_1.DynamicValues.POINT_SYSTEM.TYPES.WATCHLIST, currentUserLevel);
        }
    }
    _convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }
    count(where) {
        return this.watchListRepository.count(where);
    }
    async find(userId, limit, offset) {
        const watchList = await this.watchListRepository.find({
            where: {
                watchlist_user_id: userId,
            },
            limit: limit,
            offset: offset,
            order: ['watchlist_date DESC'],
            include: [
                {
                    relation: 'market',
                    scope: {
                        include: [{
                                relation: 'history',
                                scope: {
                                    limit: 2,
                                    order: ['stock_history_date DESC']
                                }
                            }]
                    }
                },
                {
                    relation: 'alert',
                    scope: {
                        where: {
                            notification_type: 1,
                            notification_user_id: userId,
                            notification_status: 0
                        }
                    }
                }
            ]
        });
        /*   for await (const watchListItem of watchList) {
            await this.utilService.handleMarketHistory(watchListItem.market);
          } */
        return watchList;
    }
    searchWatchList(userId, search, limit, offset) {
        return new Promise((resolve, reject) => {
            const query = "SELECT watchlist.* FROM watchlist RIGHT JOIN stock_list ON \
      watchlist.watchlist_stock_id = stock_list.stock_id WHERE \
      watchlist.watchlist_user_id=" + userId + "  AND\
      LOWER(stock_list.stock_name) LIKE LOWER('" + search + "%') AND\
      watchlist.watchlist_id IS NOT NULL \
      ORDER BY  watchlist.watchlist_date DESC \
      LIMIT " + limit + " offset " + offset + " ;  ";
            console.log(query);
            this.watchListRepository.execute(query).then(async (result) => {
                result = JSON.parse(JSON.stringify(result));
                for await (const item of result) {
                    item.market = await this.marketListRepository.findOne({
                        where: {
                            stock_id: item.watchlist_stock_id,
                        },
                        include: [
                            {
                                relation: 'history',
                                scope: {
                                    limit: 2,
                                    order: ['stock_history_date DESC'],
                                }
                            }
                        ]
                    });
                    // await this.utilService.handleMarketHistory((item as any).market);
                    item.alert = await this.notificationsRepository.findOne({
                        where: {
                            notification_stock_id: item.watchlist_stock_id,
                            notification_type: 1,
                            notification_user_id: userId,
                            notification_status: 0
                        }
                    });
                }
                console.log("result end");
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
    async findById(id, userId) {
        const watchList = await this.watchListRepository.findOne({
            where: {
                watchlist_user_id: userId,
                watchlist_id: id,
            },
            include: [
                {
                    relation: 'market',
                    scope: {
                        include: [{
                                relation: 'history',
                                scope: {
                                    limit: 2,
                                    order: ['stock_history_date DESC']
                                }
                            }]
                    }
                },
                {
                    relation: 'alert',
                    scope: {
                        where: {
                            notification_type: 1,
                            notification_user_id: userId,
                            notification_status: 0
                        }
                    }
                }
            ]
        });
        if (watchList) {
            //await this.utilService.handleMarketHistory(watchList.market);
        }
        return watchList;
    }
    updateById(id, userId, watchList) {
        return this.watchListRepository.updateAll(watchList, {
            watchlist_id: id,
            watchlist_user_id: userId,
        });
    }
    async deleteById(id, userId) {
        try {
            const watchList = await this.watchListRepository.findOne({
                where: {
                    watchlist_id: id,
                    watchlist_user_id: userId
                }
            });
            if (!watchList) {
                throw new rest_1.HttpErrors.BadRequest("Invalid watch list");
            }
            await this.watchListRepository.deleteAll({
                watchlist_id: id,
                watchlist_user_id: userId
            });
            await this.notificationsRepository.deleteAll({
                notification_type: 1,
                notification_user_id: userId,
                notification_stock_id: watchList.watchlist_stock_id,
                notification_status: 0,
            });
            return { count: 1 };
        }
        catch (err) {
            throw err;
        }
        return { count: 0 };
    }
    async setAlertForWatchList(watchListId, userId, amount) {
        const watchList = await this.watchListRepository.findOne({
            where: {
                watchlist_id: watchListId,
                watchlist_user_id: userId,
            },
            include: [
                {
                    relation: 'market',
                    scope: {
                        where: {
                            //filter active market
                            status: 0
                        }
                    }
                }
            ]
        });
        if (watchList && watchList.market) {
            const activeNotification = await this.notificationsRepository.findOne({
                where: {
                    notification_user_id: userId,
                    notification_stock_id: watchList.watchlist_stock_id,
                    notification_type: 1,
                    notification_status: 0
                }
            });
            if (activeNotification) {
                //modify
                await this.notificationsRepository.updateById(activeNotification.notification_id, {
                    notification_price: amount,
                    notification_execute_date: this._convertUTCDateToLocalDate(new Date()),
                    notification_start_date: this._convertUTCDateToLocalDate(new Date()),
                });
                return 1;
            }
            else {
                //create new
                await this.notificationsRepository.create({
                    notification_execute_date: this._convertUTCDateToLocalDate(new Date()),
                    notification_user_id: userId,
                    notification_type: 1,
                    notification_heading: "Watch List Alert",
                    notification_text: "",
                    notification_price: amount,
                    notification_shedule_date: this._convertUTCDateToLocalDate(new Date()),
                    notification_stock_id: watchList.watchlist_stock_id,
                    notification_status: 0,
                    notification_start_date: this._convertUTCDateToLocalDate(new Date()),
                });
                return 1;
            }
        }
        else {
            throw (new rest_1.HttpErrors.BadRequest("Watch list stock not found"));
        }
    }
    async removeAlertForWatchList(notificationId, userId) {
        const activeNotification = await this.notificationsRepository.findOne({
            where: {
                notification_user_id: userId,
                notification_id: notificationId,
                notification_type: 1,
                notification_status: 0
            }
        });
        if (activeNotification) {
            await this.notificationsRepository.updateById(notificationId, {
                notification_status: 2
            });
            return 1;
        }
        else {
            throw (new rest_1.HttpErrors.BadRequest("Alert not found"));
        }
    }
};
WatchListService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.WatchListRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.MarketRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.NotificationsRepository)),
    tslib_1.__param(3, (0, core_1.service)(util_service_1.UtilService)),
    tslib_1.__param(4, (0, core_1.service)(user_points_service_1.UserPointsService)),
    tslib_1.__param(5, (0, repository_1.repository)(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.WatchListRepository,
        repositories_1.MarketRepository,
        repositories_1.NotificationsRepository,
        util_service_1.UtilService,
        user_points_service_1.UserPointsService,
        repositories_1.UserRepository])
], WatchListService);
exports.WatchListService = WatchListService;
//# sourceMappingURL=watch-list.service.js.map