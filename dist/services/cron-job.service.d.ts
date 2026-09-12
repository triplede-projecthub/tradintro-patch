import { ConsoleLoggerService } from './console-logger.service';
export declare class CronJobService {
    private logger;
    constructor(logger: ConsoleLoggerService);
    private jobs;
    start(tag: string, callback?: Function, cronJobSchedule?: string): void;
    stop(tag: string): void;
}
