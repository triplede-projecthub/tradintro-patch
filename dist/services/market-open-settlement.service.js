"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketOpenSettlementService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const repositories_1 = require("../repositories");
const constants_1 = require("../utils/constants");
const console_logger_service_1 = require("./console-logger.service");
const cron_job_service_1 = require("./cron-job.service");
const portfolio_service_1 = require("./portfolio.service");
/**
 * TI24-0242-001: settles after-market 'market' orders once the market opens.
 *
 * An order placed of execution type MARKET while the market is closed is stored with
 * market_status = OFFLINE. Nothing then moved it on: findHoldingsCount() only counts rows with
 * market_status = ONLINE, and PortfolioItem.transactionStatus() reports any OFFLINE row as
 * REQUESTED - so the order sat there looking pending forever instead of going through at the next
 * open. This job does the transition the rest of the code was already written to expect.
 *
 * It deliberately does NOT re-price. The order was priced, charged and checked against the wallet
 * when it was placed; re-pricing at the opening price would have to redo the charge calculation and
 * the wallet check, and could fail after the user was already told the order was accepted. Orders
 * settle at the price they were accepted at.
 */
let MarketOpenSettlementService = class MarketOpenSettlementService {
    constructor(logger, cronJob, portfolioService, portfolioRepository) {
        this.logger = logger;
        this.cronJob = cronJob;
        this.portfolioService = portfolioService;
        this.portfolioRepository = portfolioRepository;
    }
    scheduleCroneJob() {
        this.cronJob.start(constants_1.DynamicValues.MARKET_OPEN_SETTLEMENT_CRON_TRIGGER_NAME, (error) => {
            if (error) {
                this.logger.error('MARKET_OPEN_SETTLEMENT ERR>>', error);
                return;
            }
            this.settleDueOrders()
                .then(count => this.logger.debug('MARKET_OPEN_SETTLEMENT', 'settled', count))
                .catch(err => this.logger.error('MARKET_OPEN_SETTLEMENT', err));
        }, constants_1.DynamicValues.MarketOpenSettlementCronTime);
    }
    /**
     * Flips every order that was accepted while the market was shut to executed, but only while the
     * market is actually open. Returns how many rows were settled.
     */
    async settleDueOrders() {
        const now = this._convertUTCDateToLocalDate(new Date());
        const marketStatus = await this.portfolioService.getMarketStatus(now);
        if (marketStatus !== constants_1.MarketFlags.MARKET_STATUS.ONLINE) {
            return 0;
        }
        const result = await this.portfolioRepository.updateAll({
            market_status: constants_1.MarketFlags.MARKET_STATUS.ONLINE,
            order_status: constants_1.MarketFlags.ORDER_STATUS.DONE,
            order_executed_on: now,
        }, {
            order_execution_type: constants_1.MarketFlags.EXECUTION_TYPE.MARKET,
            market_status: constants_1.MarketFlags.MARKET_STATUS.OFFLINE,
            portfolio_status: constants_1.MarketFlags.PORTFOLIO_STATUS.CURRENT_HOLDING,
            order_status: {
                inq: [
                    constants_1.MarketFlags.ORDER_STATUS.DONE,
                    constants_1.MarketFlags.ORDER_STATUS.REQUESTED,
                ],
            },
        });
        return result.count;
    }
    _convertUTCDateToLocalDate(date) {
        return new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
    }
};
MarketOpenSettlementService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__param(0, (0, core_1.service)(console_logger_service_1.ConsoleLoggerService)),
    tslib_1.__param(1, (0, core_1.service)(cron_job_service_1.CronJobService)),
    tslib_1.__param(2, (0, core_1.service)(portfolio_service_1.PortfolioService)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.PortfolioItemRepository)),
    tslib_1.__metadata("design:paramtypes", [console_logger_service_1.ConsoleLoggerService,
        cron_job_service_1.CronJobService,
        portfolio_service_1.PortfolioService,
        repositories_1.PortfolioItemRepository])
], MarketOpenSettlementService);
exports.MarketOpenSettlementService = MarketOpenSettlementService;
//# sourceMappingURL=market-open-settlement.service.js.map