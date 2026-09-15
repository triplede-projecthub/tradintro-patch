import { PortfolioItemRepository } from '../repositories';
import { ConsoleLoggerService } from './console-logger.service';
import { CronJobService } from './cron-job.service';
import { PortfolioService } from './portfolio.service';
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
export declare class MarketOpenSettlementService {
    private logger;
    private cronJob;
    private portfolioService;
    private portfolioRepository;
    constructor(logger: ConsoleLoggerService, cronJob: CronJobService, portfolioService: PortfolioService, portfolioRepository: PortfolioItemRepository);
    scheduleCroneJob(): void;
    /**
     * Flips every order that was accepted while the market was shut to executed, but only while the
     * market is actually open. Returns how many rows were settled.
     */
    settleDueOrders(): Promise<number>;
    _convertUTCDateToLocalDate(date: Date): Date;
}
