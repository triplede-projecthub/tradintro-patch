"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketService = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-explicit-any */
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const axios_1 = tslib_1.__importDefault(require("axios"));
const repositories_1 = require("../repositories");
const util_service_1 = require("./util.service");
let MarketService = class MarketService {
    constructor(marketListRepository, notificationsRepository, marketHistoryRepository, utilService) {
        this.marketListRepository = marketListRepository;
        this.notificationsRepository = notificationsRepository;
        this.marketHistoryRepository = marketHistoryRepository;
        this.utilService = utilService;
    }
    getMarketDateOfStock(stockCode) {
        const apiKey = process.env.STOCK_INFO_API_KEY;
        return new Promise((resolve, reject) => {
            var config = {
                method: 'get',
                url: "http://api.marketstack.com/v1/eod/latest?access_key=" + apiKey + "&symbols=" + stockCode,
                headers: {}
            };
            (0, axios_1.default)(config)
                .then(async (response) => {
                const stockHistory = await this.marketHistoryRepository.findOne({
                    where: {
                        stock_history_code: stockCode
                    },
                    order: ['stock_history_date DESC']
                });
                if (response.data && response.data.data && stockHistory && stockHistory.original_date) {
                    response.data.data[0].date = stockHistory && stockHistory.original_date;
                }
                resolve(response.data);
            })
                .catch((error) => {
                console.log("STOCK DATE FETCH ISSUE", error.message);
                reject(error);
            });
        });
    }
    getStockNews(userId, stockId, notification_type, search, limit, offset, stockNews) {
        const notificationTypeArray = notification_type.split(',');
        const notificationTypeObj = notificationTypeArray.map(str => {
            return Number(str);
        });
        return new Promise((resolve, reject) => {
            let stockFilter = " AND notification.notification_user_id = " + userId +
                " ORDER BY notification.notification_execute_date DESC ";
            if (stockNews) {
                stockFilter = ' GROUP BY notification_news_id ORDER BY notification.notification_execute_date ASC ';
            }
            let filter = '';
            if (search) {
                filter = " LOWER(notification.notification_text) LIKE LOWER('%" + search + "%') AND ";
            }
            const query = "SELECT notification.* FROM notification  WHERE \
    notification.notification_type IN (" + notificationTypeObj + ") AND \
    notification.notification_stock_id = " + stockId + " AND \
     " + filter +
                "notification.notification_id IS NOT NULL \
           " + stockFilter + "  \
    LIMIT " + limit + " offset " + offset + " ;  ";
            const includeFilter = [
                {
                    relation: 'history',
                    scope: {
                        limit: 1,
                        order: ['stock_history_date DESC'],
                    }
                }
            ];
            console.log("Notification", query);
            this.notificationsRepository.execute(query).then(async (result) => {
                result = JSON.parse(JSON.stringify(result));
                for await (const item of result) {
                    item.market = await this.marketListRepository.findOne({
                        where: {
                            stock_id: item.notification_stock_id,
                        },
                        include: includeFilter
                    });
                    //await this.utilService.handleMarketHistory((item as any).market)
                }
                console.log("result end");
                resolve(result);
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
    count(where) {
        return this.marketListRepository.count(where);
    }
    async find(userId, limit, offset, stock_type, stock_status, stock_indices_id, search) {
        const where = {};
        if (search && search.length > 0) {
            where.stock_name = {
                like: search + '%'
            };
        }
        if (+stock_indices_id > 0) {
            where.stock_indices_id = +stock_indices_id;
        }
        const stock_status_array = stock_status.split(',');
        const stock_status_converted = stock_status_array.map(str => {
            return Number(str);
        });
        if (stock_status_converted && stock_status_converted.length > 0) {
            where.status = {
                inq: stock_status_converted
            };
        }
        const stock_type_array = stock_type.split(',');
        const stock_type_converted = stock_type_array.map(str => {
            return Number(str);
        });
        if (stock_type_converted && stock_type_converted.length > 0) {
            where.stock_type = {
                inq: stock_type_converted
            };
        }
        const markets = await this.marketListRepository.find({
            where: where,
            limit: limit,
            offset: offset,
            order: ['stock_name ASC'],
            include: [{
                    relation: 'history',
                    scope: {
                        limit: 2,
                        order: ['stock_history_date DESC'],
                    }
                },
                {
                    relation: 'stockInfo'
                }
            ]
        });
        /* for await (const market of markets) {
          await this.utilService.handleMarketHistory(market);
        } */
        return markets;
    }
    async findById(id, filter) {
        const market = await this.marketListRepository.findById(id, filter);
        /*  if(market) {
           await this.utilService.handleMarketHistory(market);
         } */
        return market;
    }
    findTransactionForMarketById(id, userId, orderStatus, portfolioStatus, marketStatus) {
        const orderStatusArray = orderStatus.split(',');
        const orderStatusObj = orderStatusArray.map(str => {
            return Number(str);
        });
        const portfolioStatusArray = portfolioStatus.split(',');
        const portfolioStatusObj = portfolioStatusArray.map(str => {
            return Number(str);
        });
        const marketStatusArray = marketStatus.split(',');
        const marketStatusObj = marketStatusArray.map(str => {
            return Number(str);
        });
        const filter = {};
        const portfolioRelation = {
            relation: 'portfolioItems',
            scope: {
                where: {
                    portfolio_status: {
                        inq: portfolioStatusObj
                    },
                    order_status: {
                        inq: orderStatusObj
                    },
                    market_status: {
                        inq: marketStatusObj
                    },
                    order_user_id: userId
                }
            }
        };
        filter.include = [portfolioRelation];
        return this.marketListRepository.findById(id, filter);
    }
    async findSimilarStocks(userId, stockId, limit) {
        var _a;
        const marketList = [];
        let marketIds = [];
        //open price
        const market = await this.marketListRepository.findById(stockId, {
            include: [
                {
                    relation: 'history',
                    scope: {
                        limit: 1,
                        order: ['stock_history_date DESC'],
                    }
                },
                { relation: "stockInfo" }
            ]
        });
        if (market) {
            let exchange = 'XN';
            if (market.stock_api_code.indexOf('.') > -1) {
                exchange = market.stock_api_code.split('.')[1];
            }
            if (((_a = market.stockInfo) === null || _a === void 0 ? void 0 : _a.sector) && market.history && market.history.length > 0) {
                //get stock same as sector and greater open value
                let result = await this._findBetterStocksInSimilarSector(market, exchange, market.history[0].stock_history_open, limit);
                if (result && result.length > 0) {
                    marketIds = result;
                }
                if (marketIds.length < limit) {
                    const excludedIds = [market.stock_id];
                    for (const found of marketIds) {
                        excludedIds.push(found.stock_id);
                    }
                    result = await this._findAnyStocksInSimilarSector(market, exchange, limit, excludedIds);
                    if (result && result.length > 0) {
                        marketIds.push(...result);
                    }
                }
            }
            if (!marketIds || marketIds.length === 0 || marketIds.length < limit)
                marketIds = await this._findAnyStocksWithByPerformance(stockId, exchange, limit);
            if (marketIds && marketIds.length > 0) {
                for (let i = 0; i < marketIds.length; i++) {
                    const market = await this.marketListRepository.findById(marketIds[i].stock_id, {
                        include: [
                            {
                                relation: 'history',
                                scope: {
                                    limit: 1,
                                    order: ['stock_history_date DESC'],
                                }
                            },
                            { relation: "stockInfo" }
                        ]
                    });
                    marketList.push(market);
                    if (marketList.length == limit) {
                        break;
                    }
                }
            }
        }
        return marketList;
    }
    async _findBetterStocksInSimilarSector(market, exchange, open_amount, limit) {
        const querySameSectorHigherValue = 'SELECT * FROM stock_list RIGHT JOIN stock_info ON stock_list.stock_code=stock_info.stock_name_short \
          RIGHt JOIN \
          stock_history \
          ON \
          stock_list.stock_api_code = stock_history.stock_history_code \
          WHERE stock_info.sector="' + market.stockInfo.sector + '" AND stock_history.stock_history_open > ' + open_amount + ' AND \
          stock_list.stock_id !=' + market.stock_id + ' AND \
           stock_list.stock_api_code like "%.' + exchange + '%" group by stock_id order by stock_history.current_price ASC limit ' + limit + ';';
        console.log("HigherValueInSameSector", querySameSectorHigherValue);
        let resultSameSectorHigherValue = await this.marketListRepository.execute(querySameSectorHigherValue);
        resultSameSectorHigherValue = JSON.parse(JSON.stringify(resultSameSectorHigherValue));
        if (resultSameSectorHigherValue && resultSameSectorHigherValue.length > 0) {
            return resultSameSectorHigherValue;
        }
        return [];
    }
    async _findAnyStocksInSimilarSector(market, exchange, limit, excludedIds) {
        const querySameSectorHigherValue = 'SELECT * FROM stock_list RIGHT JOIN stock_info ON stock_list.stock_code=stock_info.stock_name_short \
          RIGHt JOIN \
          stock_history \
          ON \
          stock_list.stock_api_code = stock_history.stock_history_code \
          WHERE stock_info.sector="' + market.stockInfo.sector + '" AND \
          stock_list.stock_id NOT IN (' + excludedIds.join(',') + ') AND \
           stock_list.stock_api_code like "%.' + exchange + '%" group by stock_id order by stock_history.current_price ASC limit ' + limit + ';';
        console.log("AnyValueInSameSector", querySameSectorHigherValue);
        let resultSameSectorHigherValue = await this.marketListRepository.execute(querySameSectorHigherValue);
        resultSameSectorHigherValue = JSON.parse(JSON.stringify(resultSameSectorHigherValue));
        if (resultSameSectorHigherValue && resultSameSectorHigherValue.length > 0) {
            return resultSameSectorHigherValue;
        }
        return [];
    }
    async _findAnyStocksWithByPerformance(stockId, exchange, limit) {
        const querySameSectorHigherValue = 'SELECT * FROM stock_list RIGHT JOIN stock_info ON stock_list.stock_code=stock_info.stock_name_short \
          RIGHt JOIN \
          stock_history \
          ON \
          stock_list.stock_api_code = stock_history.stock_history_code \
          WHERE \
          stock_list.stock_id !=' + stockId + ' AND \
           stock_list.stock_api_code like "%.' + exchange + '%" group by stock_id order by stock_history.current_price DESC limit ' + limit + ';';
        let resultSameSectorHigherValue = await this.marketListRepository.execute(querySameSectorHigherValue);
        resultSameSectorHigherValue = JSON.parse(JSON.stringify(resultSameSectorHigherValue));
        if (resultSameSectorHigherValue && resultSameSectorHigherValue.length > 0) {
            return resultSameSectorHigherValue;
        }
        return [];
    }
};
MarketService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.MarketRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.NotificationsRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.MarketHistoryRepository)),
    tslib_1.__param(3, (0, core_1.service)(util_service_1.UtilService)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MarketRepository,
        repositories_1.NotificationsRepository,
        repositories_1.MarketHistoryRepository,
        util_service_1.UtilService])
], MarketService);
exports.MarketService = MarketService;
//# sourceMappingURL=market.service.js.map