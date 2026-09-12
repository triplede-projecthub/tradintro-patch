"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronJobService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const cron_1 = require("cron");
const constants_1 = require("../utils/constants");
const console_logger_service_1 = require("./console-logger.service");
let CronJobService = class CronJobService {
    constructor(logger) {
        this.logger = logger;
        this.jobs = new Map();
    }
    start(tag, callback, cronJobSchedule = constants_1.DynamicValues.TempDeletionTriggerCronTime) {
        try {
            if (this.jobs.has(tag)) {
                this.stop(tag);
            }
            if (callback == undefined) {
                callback = (error) => {
                    this.logger.debug('CRON DEFAULT CALLBACK', tag, error);
                };
            }
            const job = new cron_1.CronJob(cronJobSchedule, () => {
                if (callback) {
                    callback();
                }
            }, null, true);
            this.jobs.set(tag, job);
            this.logger.debug('CRON SET', tag, cronJobSchedule);
        }
        catch (error) {
            if (callback) {
                callback(error);
            }
        }
    }
    stop(tag) {
        this.logger.debug('CANCEL', tag);
        if (this.jobs && this.jobs.size > 0) {
            for (const job of this.jobs) {
                if (job[0] === tag) {
                    job[1].stop();
                    this.jobs.delete(tag);
                    break;
                }
            }
        }
    }
};
CronJobService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__param(0, (0, core_1.service)(console_logger_service_1.ConsoleLoggerService)),
    tslib_1.__metadata("design:paramtypes", [console_logger_service_1.ConsoleLoggerService])
], CronJobService);
exports.CronJobService = CronJobService;
//# sourceMappingURL=cron-job.service.js.map