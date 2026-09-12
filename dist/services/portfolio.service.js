"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioService = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/naming-convention */
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const axios_1 = tslib_1.__importDefault(require("axios"));
const dayjs_1 = tslib_1.__importDefault(require("dayjs"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const models_1 = require("../models");
const portfolio_stock_dashboard_response_model_1 = require("../models/dto/portfolio-stock-dashboard-response.model");
const repositories_1 = require("../repositories");
const constants_1 = require("../utils/constants");
const profile_user_service_1 = require("./profile.user.service");
const user_points_service_1 = require("./user-points.service");
const util_service_1 = require("./util.service");
const wallet_service_1 = require("./wallet.service");
let PortfolioService = class PortfolioService {
    constructor(portfolioRepository, marketListRepository, marketHistoryRepository, notificationsRepository, holidayRepository, tradeTimingRepository, userService, utilService, walletService, userPointsService, userRepository) {
        this.portfolioRepository = portfolioRepository;
        this.marketListRepository = marketListRepository;
        this.marketHistoryRepository = marketHistoryRepository;
        this.notificationsRepository = notificationsRepository;
        this.holidayRepository = holidayRepository;
        this.tradeTimingRepository = tradeTimingRepository;
        this.userService = userService;
        this.utilService = utilService;
        this.walletService = walletService;
        this.userPointsService = userPointsService;
        this.userRepository = userRepository;
    }
    buyStock(id, userId, stockTransaction) {
        return new Promise(async (resolve, reject) => {
            var _a, _b;
            try {
                this.validateTransaction(stockTransaction);
                const orderRequestDate = this._convertUTCDateToLocalDate(new Date());
                console.log('orderRequestDate', orderRequestDate);
                const marketStatus = await this.getMarketStatus(orderRequestDate);
                console.log('MarketStatus: ' + marketStatus);
                const orderType = constants_1.MarketFlags.ORDER_TYPE.BUY;
                const orderStatus = this.getOrderStatus(marketStatus, stockTransaction.order_execution_type);
                let stockPrice = 0;
                if (stockTransaction.order_execution_type ==
                    constants_1.MarketFlags.EXECUTION_TYPE.MARKET) {
                    const stock = await this.getStockHistory(id);
                    if (stock) {
                        stockPrice =
                            (stock.stock_history_high + stock.stock_history_low) / 2;
                    }
                    else {
                        throw new rest_1.HttpErrors.BadRequest('Invalid Stock Data');
                    }
                }
                else {
                    if ((_a = stockTransaction.alert_price) !== null && _a !== void 0 ? _a : 0 > 0) {
                        stockPrice = (_b = stockTransaction.alert_price) !== null && _b !== void 0 ? _b : 0;
                    }
                    else {
                        throw new rest_1.HttpErrors.BadRequest('Invalid Alert Price');
                    }
                }
                const charges = await this.calculateChargeV2(orderType, id, stockPrice, stockTransaction.order_qty, userId, stockTransaction.product_type);
                const orderNo = await this.getGenOrderId(orderRequestDate, userId, stockTransaction.stock_code);
                /*  const wallet_trad_value = await this.userService.userTotalTradValue(userId);
                 const invested_amount = await this.userService.userTotalInvestments(userId);
        
                 const trade_money_balance = wallet_trad_value - invested_amount; */
                const summery = await this.walletService.getWalletSummery(userId);
                const validityDate = this.getValidityDate(stockTransaction, orderRequestDate);
                if (stockTransaction.product_type == constants_1.MarketFlags.PRODUCT_TYPE.HOLDING &&
                    summery.trade_money_balance < charges.totalAmount) {
                    throw new rest_1.HttpErrors.BadRequest('Insufficient balance in wallet.');
                }
                else if (stockTransaction.product_type == constants_1.MarketFlags.PRODUCT_TYPE.POSITION &&
                    (summery.available_margin < charges.marginAmount ||
                        summery.trade_money_balance < charges.totalAmount)) {
                    throw new rest_1.HttpErrors.BadRequest('Insufficient balance in wallet.');
                }
                const portfolioItem = await this.portfolioRepository.create({
                    brokerage: charges.brokageAmount,
                    market_status: marketStatus,
                    order_createdon: orderRequestDate,
                    order_email_status: 0,
                    order_execution_type: stockTransaction.order_execution_type,
                    order_no: orderNo,
                    order_price: stockPrice,
                    order_qty: stockTransaction.order_qty,
                    order_status: orderStatus,
                    order_stock_id: id,
                    order_type: orderType,
                    order_user_id: userId,
                    order_total: charges.totalAmount,
                    margin_status: stockTransaction.product_type,
                    margin_amount_used: charges.marginAmount,
                    order_executed_on: this._convertUTCDateToLocalDate(new Date()),
                    order_validity: stockTransaction.order_validity,
                    portfolio_status: constants_1.MarketFlags.PORTFOLIO_STATUS.CURRENT_HOLDING,
                    order_validity_date: validityDate,
                    total_stock_value: charges.totalStockValue,
                    transaction_charge: charges.transactionAmount,
                });
                if (stockTransaction.order_execution_type ==
                    constants_1.MarketFlags.EXECUTION_TYPE.MARKET &&
                    marketStatus == constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
                    this.handleUserTransactionPoint(userId, id, charges.totalAmount)
                        .then(() => {
                        console.log('Transaction Point Update');
                    })
                        .catch(error => {
                        console.log('Transaction Point Update', error);
                    });
                    //execute only for market execution type
                    this.createTransactionNotification(userId, id, 'BUY', stockTransaction.stock_code, orderRequestDate, this.limitDecimalPoints(stockPrice))
                        .then(() => {
                        console.log('Transaction Notification', 'ADDED');
                    })
                        .catch(e => {
                        console.log('Transaction Notification Error', e);
                    });
                }
                resolve(portfolioItem);
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    async handleUserTransactionPoint(userId, id, totalAmount) {
        var _a, _b;
        const user = await this.userRepository.findOne({
            where: {
                user_id: userId,
                user_status: {
                    inq: [0, 1],
                },
            },
            include: [
                {
                    relation: 'userLevel',
                },
            ],
        });
        if (user) {
            const portfolioActives = await this.portfolioRepository.find({
                where: {
                    order_stock_id: id,
                    order_user_id: userId,
                    market_status: 0,
                    order_status: 0,
                },
                limit: 2,
            });
            const currentUserLevel = (_b = (_a = user === null || user === void 0 ? void 0 : user.userLevel) === null || _a === void 0 ? void 0 : _a.level_position) !== null && _b !== void 0 ? _b : 1;
            if (portfolioActives && portfolioActives.length == 1)
                this.userPointsService.handleUserPoint(userId, constants_1.DynamicValues.POINT_SYSTEM.TYPES.STOCK, currentUserLevel);
            this.userPointsService.handleUserPoint(userId, constants_1.DynamicValues.POINT_SYSTEM.TYPES.BUY_TRANSACTION, currentUserLevel);
            this.userPointsService.handleUserPoint(userId, constants_1.DynamicValues.POINT_SYSTEM.TYPES.TRADE_VALUE, currentUserLevel, totalAmount);
        }
    }
    sellStock(id, userId, stockTransaction) {
        return new Promise(async (resolve, reject) => {
            var _a, _b;
            try {
                this.validateTransaction(stockTransaction);
                const orderRequestDate = this._convertUTCDateToLocalDate(new Date());
                const totalHoldingForStockId = await this.findHoldingsCount(userId, id, stockTransaction.product_type);
                console.log('STOCK HOLDINGS', totalHoldingForStockId);
                if (totalHoldingForStockId < stockTransaction.order_qty) {
                    throw new rest_1.HttpErrors.BadRequest('Invalid Stock Data');
                }
                const marketStatus = await this.getMarketStatus(orderRequestDate);
                const orderType = constants_1.MarketFlags.ORDER_TYPE.SELL;
                const orderStatus = this.getOrderStatus(marketStatus, stockTransaction.order_execution_type);
                let stockPrice = 0;
                if (stockTransaction.order_execution_type ==
                    constants_1.MarketFlags.EXECUTION_TYPE.MARKET) {
                    const stock = await this.getStockHistory(id);
                    if (stock) {
                        stockPrice =
                            (stock.stock_history_high + stock.stock_history_low) / 2;
                    }
                    else {
                        throw new rest_1.HttpErrors.BadRequest('Invalid Stock Data');
                    }
                }
                else {
                    if ((_a = stockTransaction.alert_price) !== null && _a !== void 0 ? _a : 0 > 0) {
                        stockPrice = (_b = stockTransaction.alert_price) !== null && _b !== void 0 ? _b : 0;
                    }
                    else {
                        throw new rest_1.HttpErrors.BadRequest('Invalid Alert Price');
                    }
                }
                const charges = await this.calculateChargeV2(orderType, id, stockPrice, stockTransaction.order_qty, userId, stockTransaction.product_type);
                const orderNo = await this.getGenOrderId(orderRequestDate, userId, stockTransaction.stock_code);
                const validityDate = this.getValidityDate(stockTransaction, orderRequestDate);
                const portfolioItem = await this.portfolioRepository.create({
                    brokerage: charges.brokageAmount,
                    market_status: marketStatus,
                    order_createdon: orderRequestDate,
                    order_email_status: 0,
                    order_execution_type: stockTransaction.order_execution_type,
                    order_no: orderNo,
                    order_price: stockPrice,
                    order_qty: stockTransaction.order_qty,
                    order_status: orderStatus,
                    order_stock_id: id,
                    order_type: orderType,
                    margin_status: stockTransaction.product_type,
                    margin_amount_used: charges.marginAmount,
                    order_user_id: userId,
                    order_total: charges.totalAmount,
                    order_executed_on: this._convertUTCDateToLocalDate(new Date()),
                    order_validity: stockTransaction.order_validity,
                    portfolio_status: constants_1.MarketFlags.PORTFOLIO_STATUS.CURRENT_HOLDING,
                    order_validity_date: validityDate,
                    total_stock_value: charges.totalStockValue,
                    transaction_charge: charges.transactionAmount,
                });
                //this.handlePortfolioStatus(id, userId, totalHoldingForStockId, stockTransaction.order_qty)
                if (stockTransaction.order_execution_type ==
                    constants_1.MarketFlags.EXECUTION_TYPE.MARKET &&
                    marketStatus == constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
                    this.handlePortfolioStatus(id, userId, totalHoldingForStockId, stockTransaction.order_qty, stockTransaction.product_type);
                    //execute only for market execution type
                    this.createTransactionNotification(userId, id, 'SELL', stockTransaction.stock_code, orderRequestDate, this.limitDecimalPoints(stockPrice))
                        .then(() => {
                        console.log('Transaction Notification', 'ADDED');
                    })
                        .catch(e => {
                        console.log('Transaction Notification Error', e);
                    });
                }
                resolve(portfolioItem);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    sellStockRequestUpdate(orderId, userId, stockTransaction) {
        return new Promise(async (resolve, reject) => {
            var _a, _b;
            try {
                this.validateTransaction(stockTransaction);
                const order = await this.portfolioRepository.findOne({
                    where: {
                        order_id: orderId,
                        order_user_id: userId,
                        portfolio_status: constants_1.MarketFlags.PORTFOLIO_STATUS.CURRENT_HOLDING,
                        order_status: {
                            nin: [
                                constants_1.MarketFlags.ORDER_STATUS.CANCELLED,
                                constants_1.MarketFlags.ORDER_STATUS.EXPIRED,
                                constants_1.MarketFlags.ORDER_STATUS.REJECTED,
                            ],
                        },
                    },
                });
                if (!order) {
                    throw new rest_1.HttpErrors.BadRequest('No such order found.');
                }
                const isEditEnabled = await this.checkIsEditable(order);
                if (!isEditEnabled) {
                    throw new rest_1.HttpErrors.BadRequest("Can't modify order at this time.");
                }
                const orderRequestDate = this._convertUTCDateToLocalDate(new Date());
                const totalHoldingForStockId = await this.findHoldingsCount(userId, order.order_stock_id, stockTransaction.product_type);
                console.log('STOCK HOLDINGS', totalHoldingForStockId);
                if (totalHoldingForStockId < stockTransaction.order_qty) {
                    throw new rest_1.HttpErrors.BadRequest('Not enough holdings to sell.');
                }
                const marketStatus = await this.getMarketStatus(orderRequestDate);
                const orderType = constants_1.MarketFlags.ORDER_TYPE.SELL;
                const orderStatus = this.getOrderStatus(marketStatus, stockTransaction.order_execution_type);
                let stockPrice = 0;
                if (stockTransaction.order_execution_type ==
                    constants_1.MarketFlags.EXECUTION_TYPE.MARKET) {
                    const stock = await this.getStockHistory(order.order_stock_id);
                    if (stock) {
                        //stockPrice = (stock.stock_history_high + stock.stock_history_low) / 2;
                        stockPrice = order.order_price;
                    }
                    else {
                        throw new rest_1.HttpErrors.BadRequest('Invalid Stock Data');
                    }
                }
                else {
                    if ((_a = stockTransaction.alert_price) !== null && _a !== void 0 ? _a : 0 > 0) {
                        stockPrice = (_b = stockTransaction.alert_price) !== null && _b !== void 0 ? _b : 0;
                    }
                    else {
                        throw new rest_1.HttpErrors.BadRequest('Invalid Alert Price');
                    }
                }
                const charges = await this.calculateChargeV2(orderType, order.order_stock_id, stockPrice, stockTransaction.order_qty, userId, stockTransaction.product_type);
                //const orderNo = this.getGenOrderId(orderRequestDate, userId, stockTransaction.stock_code);
                const validityDate = this.getValidityDate(stockTransaction, orderRequestDate);
                order.brokerage = charges.brokageAmount;
                order.market_status = marketStatus;
                order.order_execution_type = stockTransaction.order_execution_type;
                order.order_price = stockPrice;
                order.order_qty = stockTransaction.order_qty;
                order.order_status = orderStatus;
                order.order_type = orderType;
                order.order_total = charges.totalAmount;
                order.margin_amount_used = charges.marginAmount;
                order.order_validity = stockTransaction.order_validity;
                order.order_validity_date = validityDate;
                order.total_stock_value = charges.totalStockValue;
                order.transaction_charge = charges.transactionAmount;
                order.order_executed_on = this._convertUTCDateToLocalDate(new Date());
                order.order_createdon = this._convertUTCDateToLocalDate(new Date());
                await this.portfolioRepository.update(order);
                if (stockTransaction.order_execution_type ==
                    constants_1.MarketFlags.EXECUTION_TYPE.MARKET &&
                    marketStatus == constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
                    this.handlePortfolioStatus(order.order_stock_id, userId, totalHoldingForStockId, stockTransaction.order_qty, stockTransaction.product_type);
                    //execute only for market execution type
                    this.createTransactionNotification(userId, order.order_stock_id, 'SELL', stockTransaction.stock_code, orderRequestDate, this.limitDecimalPoints(stockPrice))
                        .then(() => {
                        console.log('Transaction Notification', 'ADDED');
                    })
                        .catch(e => {
                        console.log('Transaction Notification Error', e);
                    });
                }
                resolve(order);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    stockRequestCancelUpdate(orderId, userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const order = await this.portfolioRepository.findOne({
                    where: {
                        order_id: orderId,
                        order_user_id: userId,
                        portfolio_status: constants_1.MarketFlags.PORTFOLIO_STATUS.CURRENT_HOLDING,
                        order_status: {
                            nin: [
                                constants_1.MarketFlags.ORDER_STATUS.CANCELLED,
                                constants_1.MarketFlags.ORDER_STATUS.EXPIRED,
                                constants_1.MarketFlags.ORDER_STATUS.REJECTED,
                            ],
                        },
                    },
                });
                if (!order) {
                    throw new rest_1.HttpErrors.BadRequest('No such order found.');
                }
                /*    const isEditEnabled = await this.checkIsEditable(order);
                   if (!isEditEnabled) {
                     throw new HttpErrors.BadRequest('Can\'t modify order at this time.')
                   } */
                order.order_status = constants_1.MarketFlags.ORDER_STATUS.CANCELLED;
                await this.portfolioRepository.update(order);
                resolve(order);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    buyStockRequestUpdate(orderId, userId, stockTransaction) {
        return new Promise(async (resolve, reject) => {
            var _a, _b;
            try {
                this.validateTransaction(stockTransaction);
                const order = await this.portfolioRepository.findOne({
                    where: {
                        order_id: orderId,
                        order_user_id: userId,
                        portfolio_status: constants_1.MarketFlags.PORTFOLIO_STATUS.CURRENT_HOLDING,
                        order_status: {
                            nin: [
                                constants_1.MarketFlags.ORDER_STATUS.CANCELLED,
                                constants_1.MarketFlags.ORDER_STATUS.EXPIRED,
                                constants_1.MarketFlags.ORDER_STATUS.REJECTED,
                            ],
                        },
                    },
                });
                if (!order) {
                    throw new rest_1.HttpErrors.BadRequest('No such order found.');
                }
                const orderRequestDate = this._convertUTCDateToLocalDate(new Date());
                if (order.order_status === constants_1.MarketFlags.ORDER_STATUS.REQUESTED &&
                    order.market_status === constants_1.MarketFlags.MARKET_STATUS.ONLINE &&
                    stockTransaction.order_execution_type ==
                        constants_1.MarketFlags.EXECUTION_TYPE.LIMIT &&
                    order.order_validity_date) {
                    //PENDING ORDER (check for validity date)
                    const currentDateWithNoTime = new Date(orderRequestDate);
                    currentDateWithNoTime.setUTCHours(0, 0, 0, 0);
                    const validityDateWithNoTime = new Date(order.order_validity_date);
                    validityDateWithNoTime.setUTCHours(0, 0, 0, 0);
                    this.consoleLog('validity check > c|v >', [
                        currentDateWithNoTime,
                        validityDateWithNoTime,
                    ]);
                    if (validityDateWithNoTime < currentDateWithNoTime) {
                        throw new rest_1.HttpErrors.BadRequest('Unable to edit order (order expired).');
                    }
                }
                const isEditEnabled = await this.checkIsEditable(order);
                if (!isEditEnabled) {
                    throw new rest_1.HttpErrors.BadRequest("Can't modify order at this time.");
                }
                const marketStatus = await this.getMarketStatus(orderRequestDate);
                const orderType = constants_1.MarketFlags.ORDER_TYPE.BUY;
                const orderStatus = this.getOrderStatus(marketStatus, stockTransaction.order_execution_type);
                let stockPrice = 0;
                if (stockTransaction.order_execution_type ==
                    constants_1.MarketFlags.EXECUTION_TYPE.MARKET) {
                    const stock = await this.getStockHistory(order.order_stock_id);
                    if (stock) {
                        //stockPrice = (stock.stock_history_high + stock.stock_history_low) / 2;
                        stockPrice = order.order_price;
                    }
                    else {
                        throw new rest_1.HttpErrors.BadRequest('Invalid Stock Data');
                    }
                }
                else {
                    if ((_a = stockTransaction.alert_price) !== null && _a !== void 0 ? _a : 0 > 0) {
                        stockPrice = (_b = stockTransaction.alert_price) !== null && _b !== void 0 ? _b : 0;
                    }
                    else {
                        throw new rest_1.HttpErrors.BadRequest('Invalid Alert Price');
                    }
                }
                const charges = await this.calculateChargeV2(orderType, order.order_stock_id, stockPrice, stockTransaction.order_qty, userId, stockTransaction.product_type);
                //const orderNo = this.getGenOrderId(orderRequestDate, userId, stockTransaction.stock_code);
                const summery = await this.walletService.getWalletSummery(userId);
                const validityDate = this.getValidityDate(stockTransaction, orderRequestDate);
                if (stockTransaction.product_type == constants_1.MarketFlags.PRODUCT_TYPE.HOLDING &&
                    summery.trade_money_balance < charges.totalAmount) {
                    throw new rest_1.HttpErrors.BadRequest('Insufficient balance in wallet.');
                }
                else if (stockTransaction.product_type == constants_1.MarketFlags.PRODUCT_TYPE.POSITION &&
                    (summery.available_margin < charges.marginAmount ||
                        summery.trade_money_balance < charges.totalAmount)) {
                    throw new rest_1.HttpErrors.BadRequest('Insufficient balance in wallet.');
                }
                order.brokerage = charges.brokageAmount;
                order.market_status = marketStatus;
                order.order_execution_type = stockTransaction.order_execution_type;
                order.order_price = stockPrice;
                order.order_qty = stockTransaction.order_qty;
                order.order_status = orderStatus;
                order.order_type = orderType;
                order.order_total = charges.totalAmount;
                order.margin_amount_used = charges.marginAmount;
                order.order_validity = stockTransaction.order_validity;
                order.order_validity_date = validityDate;
                order.total_stock_value = charges.totalStockValue;
                order.transaction_charge = charges.transactionAmount;
                order.order_executed_on = this._convertUTCDateToLocalDate(new Date());
                order.order_createdon = this._convertUTCDateToLocalDate(new Date());
                await this.portfolioRepository.update(order);
                if (stockTransaction.order_execution_type ==
                    constants_1.MarketFlags.EXECUTION_TYPE.MARKET &&
                    marketStatus == constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
                    //this.handlePortfolioStatus(order.order_stock_id, userId, totalHoldingForStockId, stockTransaction.order_qty)
                    //execute only for market execution type
                    this.createTransactionNotification(userId, order.order_stock_id, 'BUY', stockTransaction.stock_code, orderRequestDate, this.limitDecimalPoints(stockPrice))
                        .then(() => {
                        console.log('Transaction Notification', 'ADDED');
                    })
                        .catch(e => {
                        console.log('Transaction Notification Error', e);
                    });
                }
                resolve(order);
            }
            catch (err) {
                console.log(err);
                reject(err);
            }
        });
    }
    formatToTwoDigitDecimal(value) {
        const stringNum = value.toString();
        if (stringNum.split('.').length > 1) {
            if (stringNum.split('.')[1].length < 2) {
                return stringNum + '0';
            }
            return stringNum;
        }
        return stringNum + '.00';
    }
    async createTransactionNotification(userId, stockId, transactionType, stock_code, trans_date, transaction_price, symbol = 'Rs. ') {
        var _a;
        //Issue resolved - 45 (create for any user.)
        /*  const user = await this.userService.findById(userId)
         if (user === null || user.tree_level === 1) {
           return;
         } */
        const stock = await this.marketListRepository.findOne({
            where: {
                stock_code: stock_code,
            },
        });
        const trans_date_formatted = (0, dayjs_1.default)(trans_date).format('DD-MMM-YYYY');
        const template = `${transactionType} transaction for the stock ${stock_code} is\
  successful on ${trans_date_formatted} at the price ${symbol}${this.formatToTwoDigitDecimal(transaction_price)}`;
        await this.notificationsRepository.create({
            notification_execute_date: this._convertUTCDateToLocalDate(new Date()),
            notification_news_id: 0,
            notification_user_id: userId,
            notification_user_type: 'User',
            notification_price: +transaction_price,
            notification_text: template,
            notification_stock_id: stockId,
            notification_heading: (_a = stock === null || stock === void 0 ? void 0 : stock.stock_name) !== null && _a !== void 0 ? _a : 'Transaction Alert',
            notification_type: 2,
            notification_status: 1,
            notification_start_date: this._convertUTCDateToLocalDate(new Date()),
            notification_shedule_date: this._convertUTCDateToLocalDate(new Date()),
        });
    }
    handlePortfolioStatus(id, userId, totalCount, order_qty, product_type = 0) {
        if (totalCount == order_qty) {
            this.portfolioRepository
                .updateAll({
                portfolio_status: constants_1.MarketFlags.PORTFOLIO_STATUS.OLD_HOLDING,
            }, {
                order_stock_id: id,
                order_user_id: userId,
                margin_status: product_type
            })
                .then(count => {
                console.log('STOCK PORTFOLIO VALUE UPDATE', count);
            })
                .catch(err => {
                console.log('STOCK PORTFOLIO VALUE UPDATE ERR:', err);
            });
        }
    }
    getOrderStatus(marketStatus, execution_type) {
        // Business rule: when market is OFFLINE, any new order should be queued/pending
        // (including MARKET orders), not treated as executed immediately.
        if (execution_type === constants_1.MarketFlags.EXECUTION_TYPE.MARKET) {
            return marketStatus === constants_1.MarketFlags.MARKET_STATUS.ONLINE
                ? constants_1.MarketFlags.ORDER_STATUS.DONE
                : constants_1.MarketFlags.ORDER_STATUS.REQUESTED;
        }
        if (execution_type === constants_1.MarketFlags.EXECUTION_TYPE.LIMIT) {
            return constants_1.MarketFlags.ORDER_STATUS.REQUESTED;
        }
        return marketStatus === constants_1.MarketFlags.MARKET_STATUS.OFFLINE
            ? constants_1.MarketFlags.ORDER_STATUS.REQUESTED
            : constants_1.MarketFlags.ORDER_STATUS.DONE;
    }
    validateTransaction(stockTransaction) {
        if (stockTransaction.order_qty < 1) {
            throw new rest_1.HttpErrors.BadRequest('Invalid quantity');
        }
    }
    findHoldingsCount(user_id, stockId, product_type = 0) {
        if (!user_id) {
            throw new rest_1.HttpErrors.BadRequest();
        }
        return new Promise(async (resolve, reject) => {
            try {
                const queryBuy = 'SELECT sum(order_qty) as total_buy FROM order_list where order_status=0 and market_status=0 and portfolio_status=0 and order_type=0 \
      and order_user_id=' +
                    user_id +
                    ' and order_stock_id=' +
                    stockId +
                    ' and margin_status=' +
                    product_type;
                const querySell = 'SELECT sum(order_qty) as total_sell FROM order_list where order_status=0 and market_status=0 and portfolio_status=0 and order_type=1 \
      and order_user_id=' +
                    user_id +
                    ' and order_stock_id=' +
                    stockId +
                    ' and margin_status=' +
                    product_type;
                console.log(queryBuy);
                console.log(querySell);
                let buyResult = await this.marketListRepository.execute(queryBuy);
                buyResult = JSON.parse(JSON.stringify(buyResult));
                if (buyResult && buyResult.length > 0) {
                    buyResult = +buyResult[0].total_buy;
                }
                else {
                    buyResult = 0;
                }
                let sellResult = await this.marketListRepository.execute(querySell);
                sellResult = JSON.parse(JSON.stringify(sellResult));
                if (sellResult && sellResult.length > 0) {
                    sellResult = +sellResult[0].total_sell;
                }
                else {
                    sellResult = 0;
                }
                const holding = buyResult - sellResult;
                resolve(holding > 0 ? holding : 0);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async getGenOrderId(orderRequestDate, userId, stock_history_code) {
        let orderNo = 'ODR';
        //ODR20220805milisec-userid-001
        //TODO - get last order and number split with - then add 1
        const monthUtc = orderRequestDate.getUTCMonth() + 1;
        let month = monthUtc.toString();
        if (monthUtc < 10) {
            month = '0' + month;
        }
        const dayUtc = orderRequestDate.getUTCDate();
        let day = dayUtc.toString();
        if (dayUtc < 10) {
            day = '0' + day;
        }
        orderNo +=
            orderRequestDate.getFullYear() +
                '' +
                month +
                '' +
                day +
                '-' +
                userId +
                '-' +
                (await this.getIncrementedOrderId(userId));
        return orderNo;
    }
    async getIncrementedOrderId(userId) {
        const order = await this.portfolioRepository.findOne({
            where: { order_user_id: userId },
            order: ['order_id DESC'],
        });
        let orderNumber = 0;
        if (order) {
            orderNumber = +order.order_no.split('-')[2];
        }
        orderNumber++;
        if (orderNumber.toString().length < 2) {
            return '00' + orderNumber;
        }
        else if (orderNumber.toString().length < 3) {
            return '0' + orderNumber;
        }
        return orderNumber + '';
    }
    async getStockHistory(id) {
        const stock = await this.marketListRepository.findOne({
            where: {
                stock_id: id,
            },
            include: [
                {
                    relation: 'history',
                    scope: {
                        limit: 1,
                        order: ['stock_history_date DESC'],
                    },
                },
            ],
        });
        if (stock) {
            // await this.utilService.handleMarketHistory(stock)
        }
        return (stock === null || stock === void 0 ? void 0 : stock.history) && stock.history.length > 0
            ? stock.history[0]
            : undefined;
    }
    getValidityDate(stockTransaction, orderDate) {
        var _a, _b, _c, _d;
        if (stockTransaction.order_execution_type == constants_1.MarketFlags.EXECUTION_TYPE.LIMIT) {
            if (stockTransaction.order_validity == constants_1.MarketFlags.ORDER_VALIDITY.GTD) {
                const maximumAllowedDate = this._convertUTCDateToLocalDate(new Date());
                maximumAllowedDate.setDate(maximumAllowedDate.getDate() + 90);
                maximumAllowedDate.setHours(0, 0, 0, 0);
                stockTransaction.order_validity_date = new Date((_a = stockTransaction.order_validity_date) !== null && _a !== void 0 ? _a : new Date());
                (_b = stockTransaction.order_validity_date) === null || _b === void 0 ? void 0 : _b.setHours(0, 0, 0, 0);
                const requestedDateTime = (_d = (_c = stockTransaction.order_validity_date) === null || _c === void 0 ? void 0 : _c.getTime()) !== null && _d !== void 0 ? _d : 0;
                const orderTime = new Date(orderDate.getTime()).setHours(0, 0, 0, 0);
                const maximumAllowedDateTime = maximumAllowedDate.getTime();
                if (requestedDateTime >= orderTime) {
                    console.log('pass 1');
                }
                if (requestedDateTime <= maximumAllowedDateTime) {
                    console.log('pass 2');
                }
                if (requestedDateTime >= orderTime &&
                    requestedDateTime <= maximumAllowedDateTime) {
                    return stockTransaction.order_validity_date;
                }
                else {
                    throw new rest_1.HttpErrors.BadRequest('Invalid transaction date.');
                }
            }
            else if (stockTransaction.order_validity == constants_1.MarketFlags.ORDER_VALIDITY.GTC) {
                const validityDate = new Date(orderDate.getTime());
                validityDate.setDate(validityDate.getDate() + 30);
                return validityDate;
            }
        }
        return orderDate;
    }
    /* calculateCharge(orderType: number, stockPrice: number, quantity: number) {
      const totalStockValue = stockPrice * quantity;
      let totalAmount = totalStockValue;
  
      const brokageAmount = +((MarketFlags.FEE_PERCENTAGES.BROKAGE_AMOUNT) * totalAmount).toFixed(2);
      const transactionAmount = +((MarketFlags.FEE_PERCENTAGES.TRANSACTION_AMOUNT) * brokageAmount).toFixed(2);
      switch (orderType) {
        case MarketFlags.ORDER_TYPE.BUY:
          totalAmount += (brokageAmount + transactionAmount);
          break;
        case MarketFlags.ORDER_TYPE.SELL:
          totalAmount -= (brokageAmount + transactionAmount);
          break;
        default: throw new HttpErrors.BadRequest("Invalid Operation");
      }
  
      return {
        totalStockValue: this.limitDecimalPoints(totalStockValue),
        totalAmount: this.limitDecimalPoints(totalAmount),
        brokageAmount: this.limitDecimalPoints(brokageAmount),
        transactionAmount: this.limitDecimalPoints(transactionAmount),
      }
    } */
    async calculateChargeV2(orderType, stockId, stockPrice, quantity, userId, productType = constants_1.MarketFlags.PRODUCT_TYPE.HOLDING) {
        const totalStockValue = stockPrice * quantity;
        let totalAmount = 0;
        let totalCalculatedAmount = this.limitDecimalPoints(totalStockValue);
        let marginAmount = 0;
        const brokageAmount = +(constants_1.MarketFlags.FEE_PERCENTAGES.BROKAGE_AMOUNT * totalStockValue).toFixed(2);
        const transactionAmount = +(constants_1.MarketFlags.FEE_PERCENTAGES.TRANSACTION_AMOUNT * brokageAmount).toFixed(2);
        switch (orderType) {
            case constants_1.MarketFlags.ORDER_TYPE.BUY:
                totalCalculatedAmount += brokageAmount + transactionAmount;
                if (productType === constants_1.MarketFlags.PRODUCT_TYPE.POSITION) {
                    const user = await this.userService.findById(userId);
                    if (user) {
                        const portion = totalCalculatedAmount / user.user_stock_margin;
                        totalAmount = portion;
                        marginAmount = portion * (user.user_stock_margin - 1);
                        console.log('CALC', {
                            totalCalculatedAmount: totalCalculatedAmount,
                            portion: portion,
                            marginAmount: marginAmount,
                            sum: portion + marginAmount,
                        });
                    }
                    else {
                        throw new rest_1.HttpErrors.BadRequest('Invalid Operation - User Not Found.');
                    }
                }
                else {
                    totalAmount = totalCalculatedAmount;
                }
                break;
            case constants_1.MarketFlags.ORDER_TYPE.SELL:
                totalCalculatedAmount -= brokageAmount + transactionAmount;
                if (productType === constants_1.MarketFlags.PRODUCT_TYPE.POSITION) {
                    //find all non-portfolio position purchases of stocks count and margin amount
                    const buyInfo = await this.getStockCountsAndMarginAmount(constants_1.MarketFlags.ORDER_TYPE.BUY, userId, stockId);
                    //find sold non-portfolio position purchases of stocks count and margin amount
                    const sellInfo = await this.getStockCountsAndMarginAmount(constants_1.MarketFlags.ORDER_TYPE.SELL, userId, stockId);
                    //calculate avg margin recovery = margin total/currently holding stocks
                    const holdingMargin = buyInfo.marginAmount - sellInfo.marginAmount;
                    const holdingCount = buyInfo.qty - sellInfo.qty;
                    const avgMarginPortion = holdingMargin / holdingCount;
                    marginAmount = this.limitDecimalPoints(avgMarginPortion * quantity);
                    totalAmount = this.limitDecimalPoints(totalCalculatedAmount - marginAmount);
                }
                else {
                    totalAmount = totalCalculatedAmount;
                }
                break;
            default:
                throw new rest_1.HttpErrors.BadRequest('Invalid Operation');
        }
        return {
            totalStockValue: this.limitDecimalPoints(totalStockValue),
            totalAmount: this.limitDecimalPoints(totalAmount),
            marginAmount: marginAmount,
            brokageAmount: this.limitDecimalPoints(brokageAmount),
            transactionAmount: this.limitDecimalPoints(transactionAmount),
        };
    }
    async getStockCountsAndMarginAmount(transactionType, userId, stockId) {
        const resultData = {
            qty: 0,
            marginAmount: 0,
        };
        let result = await this.portfolioRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as \
      amount, sum(margin_amount_used) as margin_amount FROM order_list WHERE order_user_id=${userId} AND \
      order_status=0 AND market_status=0 AND portfolio_status=0 AND order_stock_id=${stockId} \
      AND order_type=${transactionType} `);
        result = JSON.parse(JSON.stringify(result));
        if (result && result.length > 0) {
            resultData.qty = +result[0].count;
            resultData.marginAmount = +result[0].margin_amount;
        }
        return resultData;
    }
    async deleteOrder(userId, orderId) {
        try {
            const order = await this.portfolioRepository.findOne({
                where: {
                    order_user_id: userId,
                    order_id: orderId,
                    order_status: {
                        inq: [
                            constants_1.MarketFlags.ORDER_STATUS.DONE,
                            constants_1.MarketFlags.ORDER_STATUS.REQUESTED,
                        ],
                    },
                },
            });
            if (order) {
                if (order.order_execution_type == constants_1.MarketFlags.EXECUTION_TYPE.LIMIT) {
                    if (order.order_status != constants_1.MarketFlags.ORDER_STATUS.REQUESTED) {
                        throw new rest_1.HttpErrors.BadRequest('Invalid request');
                    }
                }
                else {
                    if (order.market_status != constants_1.MarketFlags.MARKET_STATUS.OFFLINE) {
                        throw new rest_1.HttpErrors.BadRequest('Invalid request');
                    }
                }
                order.order_status = constants_1.MarketFlags.ORDER_STATUS.CANCELLED;
                await this.portfolioRepository.update(order);
                //delete notifications for portfolio (type=0)
                await this.notificationsRepository.updateAll({
                    notification_status: 2,
                }, {
                    notification_user_id: userId,
                    notification_type: 0,
                    notification_stock_id: order.order_stock_id,
                });
                return { count: 1 };
            }
        }
        catch (err) {
            console.log('DELETE ORDER ERROR', err);
        }
        throw new rest_1.HttpErrors.BadRequest('Invalid request');
    }
    count(userId, order_status, portfolio_status, order_execution_type) {
        const order_exe_status_array = order_execution_type.split(',');
        const converted = order_exe_status_array.map(str => {
            return Number(str);
        });
        return this.portfolioRepository.count({
            order_execution_type: {
                inq: converted,
            },
            order_user_id: userId,
            order_status: order_status,
            portfolio_status: portfolio_status,
        });
    }
    createPortfolio(portfolio) {
        return this.portfolioRepository.create(portfolio);
    }
    async find(user_id, order_execution_type, order_status, portfolio_status, market_status, limit = 10, offset = 0, startDate, endDate) {
        return new Promise((resolve, reject) => {
            const order_exe_status_array = order_execution_type.split(',');
            const converted = order_exe_status_array.map(str => {
                return Number(str);
            });
            const market_status_array = market_status.split(',');
            const converted_market_status = market_status_array.map(str => {
                return Number(str);
            });
            const order_status_array = order_status.split(',');
            const converted_order_status = order_status_array.map(str => {
                return Number(str);
            });
            const portfolio_status_array = portfolio_status.split(',');
            const converted_portfolio_status = portfolio_status_array.map(str => {
                return Number(str);
            });
            let order_execution_type_condition = undefined;
            if (converted && converted.length > 0) {
                order_execution_type_condition = {
                    inq: converted,
                };
            }
            let order_execution_status_condition = undefined;
            if (converted_order_status && converted_order_status.length > 0) {
                order_execution_status_condition = {
                    inq: converted_order_status,
                };
            }
            let portfolio_status_condition = undefined;
            if (converted_portfolio_status && converted_portfolio_status.length > 0) {
                portfolio_status_condition = {
                    inq: converted_portfolio_status,
                };
            }
            let market_status_condition = undefined;
            if (converted_market_status && converted_market_status.length > 0) {
                market_status_condition = {
                    inq: converted_market_status,
                };
            }
            const where = {
                order_status: order_execution_status_condition,
                portfolio_status: portfolio_status_condition,
                order_user_id: user_id,
                order_execution_type: order_execution_type_condition,
                market_status: market_status_condition,
            };
            if (startDate && endDate) {
                const startDateObj = (0, moment_1.default)(startDate, 'YYYY-MM-DDThh:mm:ss.sssZ').toDate();
                //startDateObj.setHours(0, 0, 0, 0)
                const endDateObj = (0, moment_1.default)(endDate, 'YYYY-MM-DDThh:mm:ss.sssZ').toDate();
                //endDateObj.setHours(23, 59, 50, 999)
                where.order_createdon = {
                    between: [startDateObj, endDateObj],
                };
            }
            this.portfolioRepository
                .find({
                where: where,
                limit: limit,
                offset: offset,
                order: ['order_createdon DESC'],
                include: [
                    {
                        relation: 'market',
                        scope: {
                            include: [
                                {
                                    relation: 'history',
                                    scope: {
                                        limit: 2,
                                        order: ['stock_history_date DESC'],
                                    },
                                },
                                {
                                    relation: 'stockInfo',
                                },
                            ],
                        },
                    },
                    {
                        relation: 'alert',
                        scope: {
                            where: {
                                notification_type: 0,
                                notification_user_id: user_id,
                                notification_status: 0,
                            },
                        },
                    },
                ],
            })
                .then(async (my_stocks) => {
                for await (const stock of my_stocks) {
                    //await this.utilService.handleMarketHistory(stock.market);
                    stock.isEditEnabled = await this.checkIsEditable(stock);
                    if (stock.isEditEnabled) {
                        stock.isPriceEditEnabled =
                            stock.order_execution_type == constants_1.MarketFlags.EXECUTION_TYPE.LIMIT;
                    }
                }
                resolve(my_stocks);
            })
                .catch(e => {
                reject(e);
            });
        });
    }
    async checkIsEditable(stock) {
        if (stock.order_status === constants_1.MarketFlags.ORDER_STATUS.REQUESTED) {
            if (stock.order_execution_type === constants_1.MarketFlags.EXECUTION_TYPE.LIMIT) {
                if (stock.market_status === constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
                    //check for exchange open time
                    const marketCurrentStatus = await this.getMarketStatus(this._convertUTCDateToLocalDate(new Date()));
                    return marketCurrentStatus === constants_1.MarketFlags.MARKET_STATUS.ONLINE;
                }
                else {
                    return true;
                }
            }
            else {
                return true;
            }
        }
        if (stock.order_status === constants_1.MarketFlags.ORDER_STATUS.DONE &&
            stock.order_execution_type === constants_1.MarketFlags.EXECUTION_TYPE.MARKET) {
            return stock.market_status === constants_1.MarketFlags.MARKET_STATUS.OFFLINE;
        }
        return false;
    }
    async checkIsEditableWithNew(stock, stockTransaction) {
        if (stock.order_status === constants_1.MarketFlags.ORDER_STATUS.REQUESTED) {
            if (stock.order_execution_type === constants_1.MarketFlags.EXECUTION_TYPE.LIMIT ||
                stockTransaction.order_execution_type ===
                    constants_1.MarketFlags.EXECUTION_TYPE.LIMIT) {
                if (stock.market_status === constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
                    //check for exchange open time
                    const marketCurrentStatus = await this.getMarketStatus(this._convertUTCDateToLocalDate(new Date()));
                    return marketCurrentStatus === constants_1.MarketFlags.MARKET_STATUS.ONLINE;
                }
                else {
                    return true;
                }
            }
            else {
                return true;
            }
        }
        if (stock.order_status === constants_1.MarketFlags.ORDER_STATUS.DONE &&
            (stock.order_execution_type === constants_1.MarketFlags.EXECUTION_TYPE.MARKET ||
                stockTransaction.order_execution_type ===
                    constants_1.MarketFlags.EXECUTION_TYPE.MARKET)) {
            return stock.market_status === constants_1.MarketFlags.MARKET_STATUS.OFFLINE;
        }
        return false;
    }
    async getMarketStatus(requestDate) {
        const dateWithNoTime = new Date(requestDate.getTime());
        dateWithNoTime.setUTCHours(0, 0, 0, 0);
        console.log('NowDateNoTime', dateWithNoTime);
        console.log('NowDateWithTime', requestDate);
        const holiday = await this.holidayRepository.findOne({
            where: {
                holiday_date: dateWithNoTime,
            },
        });
        console.log('HOLIDAY', holiday);
        if (!holiday) {
            //let d = new Date(requestDate.getTime() - requestDate.getTimezoneOffset() * 60000)
            //console.log("DATE-INSPECT",d);
            console.log('DATE-INSPECT-HOUR', requestDate.getUTCHours());
            console.log('DATE-INSPECT-MINUTE', requestDate.getUTCMinutes());
            const now_hour = requestDate.getUTCHours() + '';
            let now_minute = requestDate.getUTCMinutes() + '';
            const time_text = now_hour + ':' + now_minute;
            console.log('RequestDateTime', time_text);
            const current_day_name = requestDate.toLocaleDateString('en-EN', {
                weekday: 'long',
            });
            const trade_time_for_day = await this.tradeTimingRepository.findOne({
                where: {
                    time_day: current_day_name,
                },
            });
            console.log('DayName', current_day_name);
            console.log('TimeForDay', trade_time_for_day);
            if (trade_time_for_day &&
                trade_time_for_day.day_status ==
                    constants_1.MarketFlags.DAY_MARKET_OPEN_STATUS.OPEN_DAY) {
                console.log('isOfflineDay: ', trade_time_for_day.day_status ==
                    constants_1.MarketFlags.DAY_MARKET_OPEN_STATUS.OFF_DAY);
                const open_time_array = trade_time_for_day.time_open
                    .split(':')
                    .map(str => {
                    return Number(str);
                });
                const close_time_array = trade_time_for_day.time_close
                    .split(':')
                    .map(str => {
                    return Number(str);
                });
                console.log('open-close', open_time_array.join(','), close_time_array.join(','));
                //console.log(now_hour, now_minute)
                if (+now_minute < 10) {
                    now_minute = '0' + now_minute;
                }
                const openTimeHour = open_time_array[0];
                let openTimeMinute = open_time_array[1] + '';
                const closeTimeHour = close_time_array[0];
                let closeTimeMinute = close_time_array[1] + '';
                if (+closeTimeMinute < 10) {
                    closeTimeMinute = '0' + closeTimeMinute;
                }
                if (+openTimeMinute < 10) {
                    openTimeMinute = '0' + openTimeMinute;
                }
                const nowTimeAppend = +('' + now_hour + '.' + now_minute);
                const openTimeAppend = +(openTimeHour + '.' + openTimeMinute);
                const closeTimeAppend = +(closeTimeHour + '.' + closeTimeMinute);
                console.log('openTimeAPpend', openTimeAppend);
                console.log('closeAppend', closeTimeAppend);
                console.log('nowTimeAppend', nowTimeAppend);
                if (nowTimeAppend >= openTimeAppend &&
                    nowTimeAppend <= closeTimeAppend) {
                    return constants_1.MarketFlags.MARKET_STATUS.ONLINE;
                }
            }
        }
        return constants_1.MarketFlags.MARKET_STATUS.OFFLINE;
    }
    async historicalReportPagination(user_id, limit = 10, offset = 0, search = '', startDate, endDate) {
        return new Promise((resolve, reject) => {
            let dateQueryPart = '';
            if (startDate && endDate) {
                dateQueryPart =
                    "AND ( order_list.order_createdon BETWEEN STR_TO_DATE('" +
                        startDate +
                        "','%d/%m/%Y')\
         AND STR_TO_DATE('" +
                        endDate +
                        "','%d/%m/%Y') ) ";
            }
            const query = 'SELECT order_list.*,max(order_list.order_createdon) order_date FROM order_list RIGHT JOIN stock_list ON \
      order_list.order_stock_id = stock_list.stock_id WHERE \
      order_list.order_status = 0 AND \
      order_list.portfolio_status = 1 AND \
      order_list.market_status=0 AND \
      order_list.order_user_id=' +
                user_id +
                "  AND\
      LOWER(stock_list.stock_name) LIKE LOWER('" +
                search +
                "%') AND \
      order_list.order_id IS NOT NULL \
      " +
                dateQueryPart +
                '\
      GROUP BY order_stock_id \
      ORDER BY  order_date DESC \
      LIMIT ' +
                limit +
                ' offset ' +
                offset +
                ' ;  ';
            const includeFilter = [
                {
                    relation: 'history',
                    scope: {
                        limit: 1,
                        order: ['stock_history_date DESC'],
                    },
                },
            ];
            console.log(query);
            this.portfolioRepository
                .execute(query)
                .then(async (result) => {
                result = JSON.parse(JSON.stringify(result));
                for await (const item of result) {
                    item.market = await this.marketListRepository.findOne({
                        where: {
                            stock_id: item.order_stock_id,
                        },
                        include: includeFilter,
                    });
                    //await this.utilService.handleMarketHistory((item as any).market);
                    item.transactions = await this.portfolioRepository.find({
                        where: {
                            order_stock_id: item.order_stock_id,
                            order_status: 0,
                            market_status: 0,
                            order_user_id: user_id,
                            portfolio_status: 1,
                        },
                        order: ['order_createdon DESC'],
                    });
                }
                resolve(result);
            })
                .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
    async currentHoldingReportPagination(user_id, orderType, limit = 10, offset = 0, marginStatus, search = '', startDate, endDate) {
        return new Promise((resolve, reject) => {
            let dateQueryPart = '';
            if (startDate && endDate) {
                dateQueryPart =
                    "AND ( order_list.order_createdon BETWEEN STR_TO_DATE('" +
                        startDate +
                        "','%d/%m/%Y')\
         AND STR_TO_DATE('" +
                        endDate +
                        "','%d/%m/%Y') )";
            }
            let portfolioTStatusQueryPart = '';
            if (orderType === '0') {
                portfolioTStatusQueryPart = ' order_list.portfolio_status = 0 AND';
            }
            let portfolioProductQueryPart = '';
            if (marginStatus) {
                portfolioProductQueryPart =
                    ' order_list.margin_status = ' + marginStatus + ' AND';
            }
            const query = 'SELECT order_list.*,max(order_list.order_createdon) order_date FROM order_list RIGHT JOIN stock_list ON \
      order_list.order_stock_id = stock_list.stock_id WHERE \
      order_list.order_status = 0 AND \
       ' +
                portfolioProductQueryPart +
                '\
      order_list.order_type = ' +
                orderType +
                ' AND \
      order_list.market_status=0 AND \
      ' +
                portfolioTStatusQueryPart +
                '\
      order_list.order_user_id=' +
                user_id +
                "  AND\
      LOWER(stock_list.stock_name) LIKE LOWER('" +
                search +
                "%') AND \
      order_list.order_id IS NOT NULL \
      " +
                dateQueryPart +
                '\
      GROUP BY order_stock_id \
      ORDER BY  order_date DESC \
      LIMIT ' +
                limit +
                ' offset ' +
                offset +
                ' ;  ';
            const includeFilter = [
                {
                    relation: 'history',
                    scope: {
                        limit: 1,
                        order: ['stock_history_date DESC'],
                    },
                },
            ];
            console.log(query);
            this.portfolioRepository
                .execute(query)
                .then(async (result) => {
                result = JSON.parse(JSON.stringify(result));
                for await (const item of result) {
                    item.market = await this.marketListRepository.findOne({
                        where: {
                            stock_id: item.order_stock_id,
                        },
                        include: includeFilter,
                    });
                    //await this.utilService.handleMarketHistory((item as any).market);
                    item.transactions = await this.portfolioRepository.find({
                        where: {
                            order_stock_id: item.order_stock_id,
                            order_status: 0,
                            order_user_id: user_id,
                            market_status: 0,
                            portfolio_status: orderType == '0' ? 0 : undefined,
                        },
                        include: [
                            {
                                relation: 'market',
                                scope: {
                                    include: [
                                        {
                                            relation: 'history',
                                            scope: {
                                                limit: 1,
                                                order: ['stock_history_date DESC'],
                                            },
                                        },
                                    ],
                                },
                            },
                        ],
                        order: ['order_createdon DESC'],
                    });
                    /*  for await (const transaction of (item as any).transactions) {
                     await this.utilService.handleMarketHistory(transaction.market);
                   } */
                }
                console.log('result end');
                resolve(result);
            })
                .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
    async profitLossSummery(user_id) {
        return new Promise(async (resolve, reject) => {
            try {
                const values = await this.userHoldingValueV2(user_id, '0');
                const valuesAll = await this.userHoldingValueV2(user_id);
                const valuesPositions = await this.userHoldingValueV2(user_id, "1");
                const summery = await this.walletService.getWalletSummery(user_id);
                const tradeMoneyUsed = this.limitDecimalPoints(valuesPositions.total_investment - summery.margin_used);
                const report = new models_1.ProfitLossSummery();
                let realizedProfitLossValue = 0;
                const stockDistinctQuery = await this.portfolioRepository.execute('select distinct(order_stock_id) from order_list where \
        order_status=0 AND market_status = 0 AND order_type=1 AND order_user_id=' +
                    user_id);
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                let stockDistinct = stockDistinctQuery;
                stockDistinct = JSON.parse(JSON.stringify(stockDistinct));
                if (stockDistinct && stockDistinct.length > 0) {
                    for await (const stock of stockDistinct) {
                        let totalBuyPrice = 0;
                        let totalBuyCount = 0;
                        let totalSellCount = 0;
                        let totalSellValue = 0;
                        const transactions = await this.portfolioRepository.find({
                            where: {
                                order_stock_id: stock.order_stock_id,
                                order_status: 0,
                                order_user_id: user_id,
                                market_status: 0,
                            },
                            order: ['order_createdon DESC'],
                        });
                        for await (const transaction of transactions) {
                            if (transaction.order_type === 0) {
                                //BUY
                                totalBuyCount += transaction.order_qty;
                                totalBuyPrice +=
                                    transaction.order_total + transaction.margin_amount_used;
                            }
                            else {
                                totalSellCount += transaction.order_qty;
                                totalSellValue +=
                                    transaction.order_total + transaction.margin_amount_used;
                            }
                        }
                        const avgPurchasePrice = totalBuyPrice / totalBuyCount;
                        const totalBuyValue = avgPurchasePrice * totalSellCount;
                        const value = totalSellValue - totalBuyValue;
                        console.log('Value', value);
                        realizedProfitLossValue += value;
                    }
                }
                //get buy count and sell count
                //calculate avg purchase price = buy total / buy count
                //total buy value = avg purchase price * sell count
                // diff = total buy value - total sell
                report.realizedProfitLossValue = this.limitDecimalPoints(realizedProfitLossValue);
                //unrealized = current holding
                report.unRealizedProfitLossValue = this.limitDecimalPoints(valuesAll === null || valuesAll === void 0 ? void 0 : valuesAll.portfolio_change);
                report.totalInvestmentValue = this.limitDecimalPoints((values === null || values === void 0 ? void 0 : values.total_investment) + tradeMoneyUsed);
                resolve(report);
            }
            catch (err) {
                console.log('ProfitLossSummery', err);
                reject(err);
            }
        });
    }
    limitDecimalPoints(amount, limit = 3) {
        //return Math.trunc(amount * Math.pow(10, 2)) / Math.pow(10, 2);
        return this.roundNumberV1(+amount.toFixed(limit), 2);
    }
    roundNumberV1(num, scale) {
        if (!('' + num).includes('e')) {
            return +(Math.round(+(num + 'e+' + scale)) + 'e-' + scale);
        }
        else {
            const arr = ('' + num).split('e');
            let sig = '';
            if (+arr[1] + scale > 0) {
                sig = '+';
            }
            const i = +arr[0] + 'e' + sig + (+arr[1] + scale);
            const j = Math.round(+i);
            const k = +(j + 'e-' + scale);
            return k;
        }
    }
    async getAllPendingTransactionOfUser(userId, orderType, stockId) {
        const orderTypeArray = orderType.split(',');
        const orderTypeObj = orderTypeArray.map(str => {
            return Number(str);
        });
        const where = {
            order_status: {
                inq: [0, 1],
            },
            market_status: {
                inq: [0, 1],
            },
            portfolio_status: 0,
            order_type: {
                inq: orderTypeObj,
            },
            order_user_id: userId,
        };
        if (stockId) {
            where.order_stock_id = stockId;
        }
        return this.portfolioRepository.find({
            where: where,
        });
    }
    async searchPortfolio(user_id, searchName, order_execution_type, order_status, portfolio_status, market_status, limit = 10, offset = 0, startDate, endDate) {
        return new Promise((resolve, reject) => {
            const order_exe_status_array = order_execution_type.split(',');
            const converted_order_exe_status = order_exe_status_array.map(str => {
                return Number(str);
            });
            const market_status_array = market_status.split(',');
            const converted_market_status = market_status_array.map(str => {
                return Number(str);
            });
            const order_status_array = order_status.split(',');
            const converted_order_status = order_status_array.map(str => {
                return Number(str);
            });
            const portfolio_status_array = portfolio_status.split(',');
            const converted_portfolio_status = portfolio_status_array.map(str => {
                return Number(str);
            });
            let dateQueryPart = '';
            if (startDate && endDate) {
                dateQueryPart =
                    "AND ( order_list.order_createdon BETWEEN STR_TO_DATE('" +
                        startDate +
                        "','%d/%m/%Y')\
         AND STR_TO_DATE('" +
                        endDate +
                        "','%d/%m/%Y') )";
            }
            let searchFilter = '';
            if (searchName && searchName.length > 0) {
                searchFilter =
                    " LOWER(stock_list.stock_name) LIKE LOWER('" +
                        searchName +
                        "%') AND ";
            }
            const query = 'SELECT order_list.* FROM order_list RIGHT JOIN stock_list ON \
      order_list.order_stock_id = stock_list.stock_id WHERE \
      order_list.order_status IN (' +
                converted_order_status.join(',') +
                ') AND \
      order_list.portfolio_status IN (' +
                converted_portfolio_status.join(',') +
                ') AND \
      order_list.order_execution_type IN (' +
                converted_order_exe_status.join(',') +
                ') AND \
      order_list.market_status IN (' +
                converted_market_status.join(',') +
                ') AND \
      order_list.order_user_id=' +
                user_id +
                '  AND\
      ' +
                searchFilter +
                '\
      order_list.order_id IS NOT NULL \
      ' +
                dateQueryPart +
                '\
      ORDER BY  order_list.order_createdon DESC \
      LIMIT ' +
                limit +
                ' offset ' +
                offset +
                ' ;  ';
            console.log('Portfolio Search v1 > ', query);
            this.portfolioRepository
                .execute(query)
                .then(async (result) => {
                result = JSON.parse(JSON.stringify(result));
                for await (const item of result) {
                    item.market = await this.marketListRepository.findOne({
                        where: {
                            stock_id: item.order_stock_id,
                        },
                        include: [
                            {
                                relation: 'history',
                                scope: {
                                    limit: 2,
                                    order: ['stock_history_date DESC'],
                                },
                            },
                            {
                                relation: 'stockInfo',
                            },
                        ],
                    });
                    //await this.utilService.handleMarketHistory((item as any).market);
                    item.alert = await this.notificationsRepository.findOne({
                        where: {
                            notification_stock_id: item.order_stock_id,
                            notification_type: 0,
                            notification_user_id: user_id,
                            notification_status: 0,
                        },
                    });
                    item.isEditEnabled = await this.checkIsEditable(item);
                    if (item.isEditEnabled) {
                        item.isPriceEditEnabled =
                            item.order_execution_type ==
                                constants_1.MarketFlags.EXECUTION_TYPE.LIMIT;
                    }
                }
                console.log('result end');
                resolve(result);
            })
                .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
    async searchPortfolioV2(user_id, searchName, order_execution_type, order_status, portfolio_status, market_status, margin_status, stockId, limit = 10, offset = 0) {
        return new Promise((resolve, reject) => {
            const order_exe_status_array = order_execution_type.split(',');
            const converted_order_exe_status = order_exe_status_array.map(str => {
                return Number(str);
            });
            const market_status_array = market_status.split(',');
            const converted_market_status = market_status_array.map(str => {
                return Number(str);
            });
            const order_status_array = order_status.split(',');
            const converted_order_status = order_status_array.map(str => {
                return Number(str);
            });
            const portfolio_status_array = portfolio_status.split(',');
            const converted_portfolio_status = portfolio_status_array.map(str => {
                return Number(str);
            });
            let filter = ' ';
            let pre_order = 'max(order_id) as orderId,';
            let groupBy = ' GROUP BY order_list.order_stock_id ';
            let orderBy = 'orderId';
            if (stockId) {
                filter = ' order_list.order_stock_id = ' + stockId + ' AND ';
                groupBy = ' ';
                pre_order = '';
                orderBy = 'order_list.order_id';
            }
            else if (searchName) {
                filter =
                    " LOWER(stock_list.stock_name) LIKE LOWER('" +
                        searchName +
                        "%') AND ";
            }
            const query = 'SELECT ' +
                pre_order +
                'order_list.* FROM order_list RIGHT JOIN stock_list ON \
      order_list.order_stock_id = stock_list.stock_id WHERE \
      order_list.margin_status = ' +
                margin_status +
                ' AND \
      order_list.order_status IN (' +
                converted_order_status.join(',') +
                ') AND \
      order_list.portfolio_status IN (' +
                converted_portfolio_status.join(',') +
                ') AND \
      order_list.order_execution_type IN (' +
                converted_order_exe_status.join(',') +
                ') AND \
      order_list.market_status IN (' +
                converted_market_status.join(',') +
                ') AND \
      order_list.order_user_id=' +
                user_id +
                '  AND \
       ' +
                filter +
                'order_list.order_id IS NOT NULL \
       ' +
                groupBy +
                'ORDER BY  ' +
                orderBy +
                ' DESC \
      LIMIT ' +
                limit +
                ' offset ' +
                offset +
                ' ;  ';
            console.log('ORDER LIST QRY', query);
            const includeFilter = [
                {
                    relation: 'history',
                    scope: {
                        limit: stockId ? 2 : 5,
                        order: ['stock_history_date DESC'],
                    },
                },
                {
                    relation: 'stockInfo',
                },
            ];
            this.portfolioRepository
                .execute(query)
                .then(async (result) => {
                result = JSON.parse(JSON.stringify(result));
                for await (const item of result) {
                    item.market = await this.marketListRepository.findOne({
                        where: {
                            stock_id: item.order_stock_id,
                        },
                        include: includeFilter,
                    });
                    //await this.utilService.handleMarketHistory((item as any).market);
                    if (!stockId) {
                        item.alert = await this.notificationsRepository.findOne({
                            where: {
                                notification_stock_id: item.order_stock_id,
                                notification_type: 0,
                                notification_user_id: user_id,
                                notification_status: 0,
                            },
                        });
                        if (item.alert) {
                            item.alertPrice = item.alert.notification_price;
                        }
                        else {
                            item.alertPrice = 0;
                        }
                        item.isEditEnabled =
                            await this.checkIsEditable(item);
                        if (item.isEditEnabled) {
                            item.isPriceEditEnabled =
                                item.order_execution_type ==
                                    constants_1.MarketFlags.EXECUTION_TYPE.LIMIT;
                        }
                        let buyQuantity = 0;
                        let buyTotalAmount = 0;
                        let sellTotalAmount = 0;
                        let buyQuantityResult = await this.portfolioRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as \
              amount, sum(margin_amount_used) as margin_amount FROM order_list WHERE order_user_id=${user_id} AND \
              order_status=0 AND market_status=0 AND portfolio_status=0 AND order_stock_id=${item.order_stock_id} \
              AND order_type=0 AND margin_status=${margin_status}`);
                        buyQuantityResult = JSON.parse(JSON.stringify(buyQuantityResult));
                        if (buyQuantityResult && buyQuantityResult.length > 0) {
                            buyQuantity = +buyQuantityResult[0].count;
                            buyTotalAmount =
                                +buyQuantityResult[0].amount +
                                    +buyQuantityResult[0].margin_amount;
                        }
                        let sellQuantity = 0;
                        let sellQuantityResult = await this.portfolioRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as \
              amount, sum(margin_amount_used) as margin_amount FROM order_list WHERE order_user_id=${user_id} AND \
              order_status=0 AND market_status=0 AND portfolio_status=0 AND order_stock_id=${item.order_stock_id} \
              AND order_type=1 AND margin_status=${margin_status}`);
                        sellQuantityResult = JSON.parse(JSON.stringify(sellQuantityResult));
                        if (sellQuantityResult && sellQuantityResult.length > 0) {
                            sellQuantity = +sellQuantityResult[0].count;
                            sellTotalAmount =
                                +sellQuantityResult[0].amount +
                                    +sellQuantityResult[0].margin_amount;
                        }
                        const currentPrice = item.market.history &&
                            item.market.history.length > 0
                            ? (item.market.history[0].stock_history_high +
                                item.market.history[0].stock_history_low) /
                                2
                            : 0;
                        const qty = buyQuantity - sellQuantity;
                        const totalPrice = buyTotalAmount - sellTotalAmount;
                        const totalValue = currentPrice * qty;
                        const gainLossValue = totalValue - totalPrice;
                        item.totalQty = qty;
                        item.gainLossPercentage = this.limitDecimalPoints((gainLossValue / totalPrice) * 100);
                    }
                }
                console.log('result end');
                resolve(result);
            })
                .catch(err => {
                console.log(err);
                reject(err);
            });
        });
    }
    async findById(id, userId) {
        const portfolio = await this.portfolioRepository.findOne({
            where: {
                order_id: id,
                order_user_id: userId,
            },
            include: [
                {
                    relation: 'market',
                    scope: {
                        include: [
                            {
                                relation: 'history',
                                scope: {
                                    limit: 2,
                                    order: ['stock_history_date DESC'],
                                },
                            },
                            {
                                relation: 'stockInfo',
                            },
                        ],
                    },
                },
                {
                    relation: 'alert',
                    scope: {
                        where: {
                            notification_type: 0,
                            notification_user_id: userId,
                            notification_status: 0,
                        },
                    },
                },
            ],
        });
        if (portfolio) {
            //await this.utilService.handleMarketHistory(portfolio.market);
        }
        return portfolio;
    }
    async getPortfolioTransactions(stockId, userId, orderStatus, portfolioStatus) {
        const where = {
            order_user_id: userId,
            order_stock_id: stockId,
            portfolio_status: 0,
        };
        const orderStatusArray = orderStatus.split(',');
        const orderStatusArrayConverted = orderStatusArray.map(str => {
            return Number(str);
        });
        if (orderStatusArrayConverted && orderStatusArrayConverted.length > 0) {
            where.order_status = {
                inq: orderStatusArrayConverted,
            };
        }
        const portfolioStatusArray = portfolioStatus.split(',');
        const portfolioStatusArrayConverted = portfolioStatusArray.map(str => {
            return Number(str);
        });
        if (portfolioStatusArrayConverted &&
            portfolioStatusArrayConverted.length > 0) {
            where.portfolio_status = {
                inq: portfolioStatusArrayConverted,
            };
        }
        return this.portfolioRepository.find({
            where: where,
            order: ['order_createdon DESC'],
        });
    }
    updateById(id, portfolioItem) {
        return this.portfolioRepository.updateById(id, portfolioItem);
    }
    userHoldingValue(user_id) {
        return new Promise((resolve, reject) => {
            this.portfolioRepository
                .find({
                where: {
                    order_status: 0,
                    market_status: 0,
                    portfolio_status: 0,
                    order_execution_type: {
                        inq: [0, 1],
                    },
                    order_user_id: user_id,
                },
                include: [
                    {
                        relation: 'market',
                        scope: {
                            include: [
                                {
                                    relation: 'history',
                                    scope: {
                                        limit: 2,
                                        order: ['stock_history_date DESC'],
                                    },
                                },
                            ],
                        },
                    },
                ],
            })
                .then(async (my_stocks) => {
                var _a, _b, _c, _d, _e;
                let holding_value = 0;
                let prev_holding_value = 0;
                if (my_stocks && my_stocks.length > 0) {
                    for (const stock of my_stocks) {
                        //await this.utilService.handleMarketHistory(stock.market);
                        const history = (_a = stock === null || stock === void 0 ? void 0 : stock.market) === null || _a === void 0 ? void 0 : _a.history;
                        let value = (_b = stock === null || stock === void 0 ? void 0 : stock.order_price) !== null && _b !== void 0 ? _b : 0;
                        let second_value = (_c = stock === null || stock === void 0 ? void 0 : stock.order_price) !== null && _c !== void 0 ? _c : 0;
                        if (history && history.length > 0) {
                            value =
                                (history[0].stock_history_high +
                                    history[0].stock_history_low) /
                                    2;
                            if (history.length > 1)
                                second_value =
                                    (history[1].stock_history_high +
                                        history[1].stock_history_low) /
                                        2;
                        }
                        holding_value += +((_d = stock.order_qty) !== null && _d !== void 0 ? _d : 0) * value;
                        prev_holding_value += +((_e = stock.order_qty) !== null && _e !== void 0 ? _e : 0) * second_value;
                    }
                }
                resolve({
                    holding_value: holding_value,
                    prev_holding_value: prev_holding_value,
                });
            })
                .catch(e => {
                reject(e);
            });
        });
    }
    userHoldingValueV2(user_id, marginStatus) {
        return new Promise(async (resolve, reject) => {
            let marginStatusQuery = '';
            if (marginStatus) {
                marginStatusQuery = `AND margin_status=${marginStatus}`;
            }
            const user = await this.userRepository.findById(user_id);
            this.portfolioRepository
                .execute(`SELECT * FROM order_list WHERE \
      order_user_id=${user_id} AND order_status=0 AND market_status=0  \
      AND portfolio_status = 0 ${marginStatusQuery} \
      GROUP BY order_stock_id`)
                .then(async (results) => {
                const portfoliosDistinct = JSON.parse(JSON.stringify(results));
                let totalHoldingBuyAmount = 0;
                let totalHoldingSellAmount = 0;
                let totalBuyAmount = 0;
                let totalSellAmount = 0;
                let totalHoldingBuyResult = await this.portfolioRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as amount, sum(margin_amount_used) as margin_amount
           FROM order_list WHERE order_user_id=${user_id} AND order_status=0 AND market_status=0 AND portfolio_status=0
           ${marginStatusQuery}
          AND order_type=0`);
                totalHoldingBuyResult = JSON.parse(JSON.stringify(totalHoldingBuyResult));
                if (totalHoldingBuyResult && totalHoldingBuyResult.length > 0) {
                    totalHoldingBuyAmount =
                        +totalHoldingBuyResult[0].amount +
                            +totalHoldingBuyResult[0].margin_amount;
                }
                let totalBuyResult = await this.portfolioRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as amount,
          sum(margin_amount_used) as margin_amount
           FROM order_list WHERE order_user_id=${user_id} AND order_status=0 AND market_status=0
           ${marginStatusQuery} AND order_type=0`);
                totalBuyResult = JSON.parse(JSON.stringify(totalBuyResult));
                if (totalBuyResult && totalBuyResult.length > 0) {
                    totalBuyAmount =
                        +totalBuyResult[0].amount + +totalBuyResult[0].margin_amount;
                }
                let totalSellResult = await this.portfolioRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as amount,
          sum(margin_amount_used) as margin_amount
           FROM order_list WHERE order_user_id=${user_id} AND order_status=0 AND market_status=0
          AND order_type=1 ${marginStatusQuery}`);
                totalSellResult = JSON.parse(JSON.stringify(totalSellResult));
                if (totalSellResult && totalSellResult.length > 0) {
                    totalSellAmount =
                        +totalSellResult[0].amount + +totalSellResult[0].margin_amount;
                }
                let totalHoldingSellResult = await this.portfolioRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as amount,
          sum(margin_amount_used) as margin_amount
           FROM order_list WHERE order_user_id=${user_id} AND order_status=0 AND market_status=0 AND portfolio_status=0
          AND order_type=1 ${marginStatusQuery}`);
                totalHoldingSellResult = JSON.parse(JSON.stringify(totalHoldingSellResult));
                if (totalHoldingSellResult && totalHoldingSellResult.length > 0) {
                    totalHoldingSellAmount =
                        +totalHoldingSellResult[0].amount +
                            +totalHoldingSellResult[0].margin_amount;
                }
                //const totalInvestment = totalHoldingBuyAmount ;
                const totalInvestment = totalHoldingBuyAmount - totalHoldingSellAmount;
                console.log(`total: ${totalInvestment} > totalSell: ${totalHoldingSellAmount} > totalBuy ${totalHoldingBuyAmount}`);
                console.log(`margin sell: ${+totalHoldingSellResult[0].margin_amount} > margin Buy: ${+totalSellResult[0].margin_amount} `);
                let totalStockValue = 0;
                let totalPortfolioCount = 0;
                let pos = 0;
                const apiFormattedDate = this.dateApiFormattedDate();
                for await (const portfolio of portfoliosDistinct) {
                    let buyQuantity = 0;
                    let buyQuantityResult = await this.portfolioRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as \
            amount, sum(margin_amount_used) as margin_amount FROM order_list WHERE order_user_id=${user_id} AND portfolio_status=0 AND \
            order_status=0 AND market_status=0  AND order_stock_id=${portfolio.order_stock_id} \
            AND order_type=0 ${marginStatusQuery}`);
                    buyQuantityResult = JSON.parse(JSON.stringify(buyQuantityResult));
                    if (buyQuantityResult && buyQuantityResult.length > 0) {
                        buyQuantity = +buyQuantityResult[0].count;
                    }
                    let sellQuantity = 0;
                    let sellQuantityResult = await this.portfolioRepository.execute(`SELECT sum(order_qty) as count, sum(order_total) as \
            amount, sum(margin_amount_used) as margin_amount FROM order_list WHERE order_user_id=${user_id} AND portfolio_status=0 AND\
            order_status=0 AND market_status=0  AND order_stock_id=${portfolio.order_stock_id} \
            AND order_type=1 ${marginStatusQuery}`);
                    sellQuantityResult = JSON.parse(JSON.stringify(sellQuantityResult));
                    if (sellQuantityResult && sellQuantityResult.length > 0) {
                        sellQuantity = +sellQuantityResult[0].count;
                    }
                    console.log('TODAY', apiFormattedDate);
                    const dateToday = new Date(Date.parse(apiFormattedDate));
                    console.log('TODAY', dateToday);
                    const market = await this.marketListRepository.findOne({
                        where: {
                            stock_id: portfolio.order_stock_id,
                        },
                        include: [
                            {
                                relation: 'history',
                                scope: {
                                    //TODO - enable with date (issue when no history with current date)
                                    /*  where: {
                                       stock_history_date: dateToday
                                     }, */
                                    limit: 1,
                                    order: ['stock_history_date DESC'],
                                },
                            },
                        ],
                    });
                    if (market) {
                        if (!market.history || market.history.length == 0) {
                            //call price api
                            /*  const lastHistory = await this.marketHistoryRepository.findOne({
                             where: {
                               stock_history_code: market.stock_api_code
                             },
                             order: ['stock_history_date DESC']
                           }); */
                            /*   const priceHistory = await this.getLatestPriceHistory(market.stock_api_code, lastHistory);
                            if (priceHistory)
                              market.history = [priceHistory] */
                        }
                        else {
                            this.consoleLog('FROM HISTORY >' + dateToday, market.stock_api_code);
                        }
                        if (market.history && market.history.length > 0) {
                            let currentPrice = (market.history[0].stock_history_high +
                                market.history[0].stock_history_low) /
                                2;
                            currentPrice = this.limitDecimalPoints(currentPrice, 3);
                            //currentPrice = this.roundNumberV1(currentPrice, 2);
                            const stockCount = buyQuantity - sellQuantity;
                            const currentStockValue = stockCount != 0 ? currentPrice * stockCount : 0;
                            this.consoleLog(market.stock_code, '--------- > ' + pos++);
                            this.consoleLog('q', buyQuantity - sellQuantity + '');
                            this.consoleLog('c p', currentPrice + '');
                            this.consoleLog('t v', currentStockValue + '');
                            totalStockValue += currentStockValue;
                            totalPortfolioCount += stockCount;
                        }
                    }
                }
                /*
              currentTotalValue = buySum-sellSum
      
              */
                const portfolioChangeAmount = totalStockValue - totalInvestment;
                const portfolioChangeAmountPercentage = totalInvestment > 0
                    ? (portfolioChangeAmount / totalInvestment) * 100
                    : 0;
                console.log('totalStockValue >' + totalStockValue);
                console.log('portfolioChangeAmount >' + portfolioChangeAmount);
                console.log('portfolioChangeAmountPercentage >' +
                    portfolioChangeAmountPercentage);
                console.log('totalInvestment >' + totalInvestment);
                const tradeMoneyUsed = user.user_stock_margin != 0 ?
                    totalInvestment / user.user_stock_margin : 0;
                const usedMargin = totalInvestment - tradeMoneyUsed;
                resolve({
                    total_buy_amount: totalBuyAmount,
                    total_sell_amount: totalSellAmount,
                    totalPortfolioQuantity: totalPortfolioCount,
                    holding_value: this.limitDecimalPoints(totalStockValue),
                    portfolio_change: this.limitDecimalPoints(portfolioChangeAmount),
                    portfolio_change_percentage: this.limitDecimalPoints(portfolioChangeAmountPercentage),
                    total_investment: this.limitDecimalPoints(totalInvestment),
                    tradeMoneyUsed: tradeMoneyUsed,
                    usedMargin: usedMargin
                });
            })
                .catch(e => {
                reject(e);
            });
        });
    }
    async getLatestPriceHistory(stock_api_code, lastHistory) {
        return new Promise(async (resolve, reject) => {
            const url = process.env.MARKET_STACK_LATEST_INFO_URL +
                '?access_key=' +
                process.env.MARKET_STACK_KEY +
                '&symbols=' +
                stock_api_code;
            const config = {
                method: 'get',
                url: url,
                headers: {},
            };
            console.log('START > STACK API LATEST', stock_api_code);
            (0, axios_1.default)(config)
                .then(async (response) => {
                if (response.status === 200 &&
                    response.data.data &&
                    response.data.data.length > 0) {
                    const data = response.data.data[0];
                    const apiDate = new Date(Date.parse(data.date.split('T')[0]));
                    if (lastHistory) {
                        if (apiDate.getTime() <= lastHistory.stock_history_date.getTime()) {
                            console.log('DONE > STACK API LATEST FROM HISTORY > ');
                            resolve(lastHistory);
                            return;
                        }
                    }
                    const history = await this.marketHistoryRepository.create({
                        stock_history_close: data.close,
                        stock_history_open: data.open,
                        stock_history_high: data.high,
                        stock_history_low: data.low,
                        stock_history_date: apiDate,
                        stock_history_code: stock_api_code,
                    });
                    resolve(history);
                    console.log('DONE > STACK API LATEST > ');
                }
                else {
                    console.log('ERR > STACK API LATEST > ');
                    resolve(lastHistory);
                }
            })
                .catch(error => {
                console.log('ERR > STACK API LATEST > ', error);
                resolve(lastHistory);
            });
        });
    }
    dateApiFormattedDate() {
        const date = (0, moment_1.default)();
        return date.format('YYYY-MM-DD');
    }
    consoleLog(tag, message) {
        new Promise((resolve, reject) => {
            console.log(tag, message);
        })
            .then(() => { })
            .catch(() => { });
    }
    async userHoldingValueOfStock(user_id, stockId, marginStatus) {
        return new Promise(async (resolve, reject) => {
            var _a;
            try {
                const data = new portfolio_stock_dashboard_response_model_1.PortfolioStockDashboardResponse({ user_id: user_id });
                let buyQuantity = 0;
                let buyTotalAmount = 0;
                let sellTotalAmount = 0;
                let buyQuery = `SELECT sum(order_qty) as count, sum(order_total) as \
          amount, sum(margin_amount_used) as margin_amount FROM order_list WHERE order_user_id=${user_id} AND \
          order_status=0 AND market_status=0 AND portfolio_status=0 AND order_stock_id=${stockId} \
          AND order_type=0 `;
                if (marginStatus)
                    buyQuery += ` AND margin_status=${marginStatus}`;
                let buyQuantityResult = await this.portfolioRepository.execute(buyQuery);
                buyQuantityResult = JSON.parse(JSON.stringify(buyQuantityResult));
                if (buyQuantityResult && buyQuantityResult.length > 0) {
                    buyQuantity = +buyQuantityResult[0].count;
                    buyTotalAmount =
                        +buyQuantityResult[0].amount +
                            +buyQuantityResult[0].margin_amount;
                }
                let sellQuantity = 0;
                let sellQuery = `SELECT sum(order_qty) as count, sum(order_total) as \
          amount, sum(margin_amount_used) as margin_amount FROM order_list WHERE order_user_id=${user_id} AND \
          order_status=0 AND market_status=0 AND portfolio_status=0 AND order_stock_id=${stockId} \
          AND order_type=1 `;
                if (marginStatus)
                    sellQuery += ` AND margin_status=${marginStatus}`;
                let sellQuantityResult = await this.portfolioRepository.execute(sellQuery);
                sellQuantityResult = JSON.parse(JSON.stringify(sellQuantityResult));
                if (sellQuantityResult && sellQuantityResult.length > 0) {
                    sellQuantity = +sellQuantityResult[0].count;
                    sellTotalAmount =
                        +sellQuantityResult[0].amount +
                            +sellQuantityResult[0].margin_amount;
                }
                data.qty = this.limitDecimalPoints(buyQuantity - sellQuantity);
                data.totalPrice = this.limitDecimalPoints(buyTotalAmount - sellTotalAmount);
                const market = await this.marketListRepository.findOne({
                    where: {
                        stock_id: stockId,
                    },
                    include: [
                        {
                            relation: 'history',
                            scope: {
                                limit: 1,
                                order: ['stock_history_date DESC'],
                            },
                        },
                    ],
                });
                /* if(market)
              await this.utilService.handleMarketHistory(market); */
                if ((market === null || market === void 0 ? void 0 : market.history) && market.history.length > 0) {
                    const currentPrice = (market.history[0].stock_history_high +
                        market.history[0].stock_history_low) /
                        2;
                    data.currentPrice = this.limitDecimalPoints(currentPrice);
                    data.stockName = market.stock_name;
                    data.stockApiCode = market.stock_api_code;
                    data.stockCode = market.stock_code;
                    const activeNotification = await this.notificationsRepository.findOne({
                        where: {
                            notification_user_id: user_id,
                            notification_stock_id: stockId,
                            notification_type: 0,
                            notification_status: 0,
                        },
                    });
                    if (activeNotification) {
                        data.alertPrice = (_a = activeNotification.notification_price) !== null && _a !== void 0 ? _a : 0;
                    }
                }
                data.avgPurchasePrice = this.limitDecimalPoints(buyQuantity > 0 ? buyTotalAmount / buyQuantity : 0); // TI26-006-001
                data.totalValue = this.limitDecimalPoints(data.currentPrice * data.qty);
                data.gainLossValue = this.limitDecimalPoints(data.totalValue - data.totalPrice);
                data.gainLossPercentage = this.limitDecimalPoints((data.gainLossValue / data.totalPrice) * 100);
                resolve(data);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async setAlertForPortfolio(portfolioId, userId, amount) {
        const portfolio = await this.portfolioRepository.findOne({
            where: {
                order_id: portfolioId,
            },
            include: [
                {
                    relation: 'market',
                    scope: {
                        where: {
                            //filter active market
                            status: 0,
                        },
                    },
                },
            ],
        });
        if (portfolio && portfolio.market) {
            const activeNotification = await this.notificationsRepository.findOne({
                where: {
                    notification_user_id: userId,
                    notification_stock_id: portfolio.order_stock_id,
                    notification_type: 0,
                    notification_status: 0,
                },
            });
            if (activeNotification) {
                //modify
                activeNotification.notification_price = amount;
                await this.notificationsRepository.updateById(activeNotification.notification_id, {
                    notification_price: amount,
                    notification_execute_date: this._convertUTCDateToLocalDate(new Date()),
                    notification_start_date: this._convertUTCDateToLocalDate(new Date()),
                });
                activeNotification.notification_price = amount;
                activeNotification.notification_execute_date =
                    this._convertUTCDateToLocalDate(new Date());
                activeNotification.notification_start_date =
                    this._convertUTCDateToLocalDate(new Date());
                return activeNotification;
            }
            else {
                //create new
                return this.notificationsRepository.create({
                    notification_execute_date: this._convertUTCDateToLocalDate(new Date()),
                    notification_user_id: userId,
                    notification_type: 0,
                    notification_heading: 'Portfolio Alert',
                    notification_text: '',
                    notification_shedule_date: this._convertUTCDateToLocalDate(new Date()),
                    notification_stock_id: portfolio.order_stock_id,
                    notification_status: 0,
                    notification_price: amount,
                    notification_start_date: this._convertUTCDateToLocalDate(new Date()),
                });
            }
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('Portfolio not found');
        }
    }
    async removeAlertForPortfolio(notificationId, userId) {
        const activeNotification = await this.notificationsRepository.findOne({
            where: {
                notification_user_id: userId,
                notification_id: notificationId,
                notification_type: 0,
                notification_status: 0,
            },
        });
        if (activeNotification) {
            await this.notificationsRepository.updateById(notificationId, {
                notification_status: 2,
                notification_execute_date: this._convertUTCDateToLocalDate(new Date()),
                notification_start_date: this._convertUTCDateToLocalDate(new Date()),
            });
            return 1;
        }
        else {
            throw new rest_1.HttpErrors.BadRequest('Alert not found');
        }
    }
    _convertUTCDateToLocalDate(date) {
        const newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }
};
PortfolioService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.PortfolioItemRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.MarketRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.MarketHistoryRepository)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.NotificationsRepository)),
    tslib_1.__param(4, (0, repository_1.repository)(repositories_1.HolidaysRepository)),
    tslib_1.__param(5, (0, repository_1.repository)(repositories_1.TradeTimingsRepository)),
    tslib_1.__param(6, (0, core_1.service)(profile_user_service_1.ProfileUserService)),
    tslib_1.__param(7, (0, core_1.service)(util_service_1.UtilService)),
    tslib_1.__param(8, (0, core_1.service)(wallet_service_1.WalletService)),
    tslib_1.__param(9, (0, core_1.service)(user_points_service_1.UserPointsService)),
    tslib_1.__param(10, (0, repository_1.repository)(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.PortfolioItemRepository,
        repositories_1.MarketRepository,
        repositories_1.MarketHistoryRepository,
        repositories_1.NotificationsRepository,
        repositories_1.HolidaysRepository,
        repositories_1.TradeTimingsRepository,
        profile_user_service_1.ProfileUserService,
        util_service_1.UtilService,
        wallet_service_1.WalletService,
        user_points_service_1.UserPointsService,
        repositories_1.UserRepository])
], PortfolioService);
exports.PortfolioService = PortfolioService;
//# sourceMappingURL=portfolio.service.js.map