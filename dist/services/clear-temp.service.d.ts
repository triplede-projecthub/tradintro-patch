import { ConsoleLoggerService } from './console-logger.service';
import { CronJobService } from './cron-job.service';
export declare class ClearTempService {
    private logger;
    private cronJob;
    constructor(logger: ConsoleLoggerService, cronJob: CronJobService);
    scheduleCroneJob(): void;
    private clearLogFiles;
    private clearTempImages;
}
