"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const axios_1 = tslib_1.__importDefault(require("axios"));
const moment_1 = tslib_1.__importDefault(require("moment"));
const repositories_1 = require("../repositories");
let orderNumber = 0;
let UtilService = class UtilService {
    constructor(marketHistoryRepository) {
        this.marketHistoryRepository = marketHistoryRepository;
    }
    async handleMarketHistory(market) {
        if (market) {
            const apiFormattedDate = this.dateApiFormattedDate();
            const dateToday = new Date(Date.parse(apiFormattedDate));
            let priceHistory = null;
            if (!market.history || market.history.length == 0) {
                //call api anyway -- proceed to last
                console.log("HISTORY EMPTY > API CALL INIT", apiFormattedDate, market.stock_api_code);
                priceHistory = await this.getLatestPriceHistory(market.stock_api_code);
            }
            else {
                if (market.history.length > 1)
                    market.history = market.history.sort((a, b) => a.stock_history_date.getTime() < b.stock_history_date.getTime() ? 1 : -1);
                if (market.history[0].stock_history_date.getTime() < dateToday.getTime()) {
                    //call api
                    console.log("HISTORY INVALID > API CALL INIT", apiFormattedDate, market.stock_api_code, dateToday);
                    priceHistory = await this.getLatestPriceHistory(market.stock_api_code, market.history[0]);
                }
                else {
                    console.log("HISTORY VALID > SKIP API");
                    return;
                }
            }
            if (priceHistory) {
                if (market.history)
                    market.history[0] = priceHistory;
                else
                    market.history = [priceHistory];
            }
        }
    }
    async getLatestPriceHistory(stock_api_code, lastHistory = null) {
        return new Promise(async (resolve, reject) => {
            const url = process.env.MARKET_STACK_LATEST_INFO_URL +
                '?access_key=' + process.env.MARKET_STACK_KEY + '&symbols=' + stock_api_code;
            const config = {
                method: 'get',
                url: url,
                headers: {}
            };
            console.log("START > STACK API LATEST", stock_api_code);
            (0, axios_1.default)(config)
                .then(async (response) => {
                if (response.status === 200 && response.data.data && response.data.data.length > 0) {
                    const data = response.data.data[0];
                    const apiDate = new Date(Date.parse(data.date.split("T")[0]));
                    if (lastHistory) {
                        if (apiDate.getTime() <= lastHistory.stock_history_date.getTime()) {
                            console.log("DONE > STACK API LATEST FROM HISTORY > ", apiDate);
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
                        stock_history_code: stock_api_code
                    });
                    resolve(history);
                    console.log("DONE > STACK API LATEST > ");
                }
                else {
                    console.log("ERR > STACK API LATEST > ");
                    resolve(lastHistory);
                }
            })
                .catch((error) => {
                console.log("ERR > STACK API LATEST > ", error);
                resolve(lastHistory);
            });
        });
    }
    dateApiFormattedDate() {
        var date = (0, moment_1.default)();
        return date.format("YYYY-MM-DD");
    }
};
UtilService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.MarketHistoryRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.MarketHistoryRepository])
], UtilService);
exports.UtilService = UtilService;
//# sourceMappingURL=util.service.js.map