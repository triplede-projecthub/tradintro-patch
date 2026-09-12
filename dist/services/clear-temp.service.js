"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClearTempService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const constants_1 = require("../utils/constants");
const console_logger_service_1 = require("./console-logger.service");
const cron_job_service_1 = require("./cron-job.service");
let ClearTempService = class ClearTempService {
    constructor(logger, cronJob) {
        this.logger = logger;
        this.cronJob = cronJob;
    }
    scheduleCroneJob() {
        this.cronJob.start(constants_1.DynamicValues.TEMP_DELETION_CRON_TRIGGER_NAME, (error) => {
            if (!error) {
                this.logger.debug('CLEAR_TEMP TRIGGER');
                const currentDate = new Date();
                currentDate.setDate(currentDate.getDate() - constants_1.DynamicValues.TempDeletionPeriodInDays);
                const filterTime = currentDate.getTime();
                this.clearLogFiles(filterTime);
                this.clearTempImages(filterTime);
            }
            else {
                this.logger.error('CLEAR_TEMP ERR>>', error);
            }
        });
    }
    clearLogFiles(filterTime) {
        new Promise(async (resolve, reject) => {
            var _a, _b;
            try {
                const appLogFolder = path_1.default.join(__dirname, (_a = process.env.APP_LOGS_DIR_PATH) !== null && _a !== void 0 ? _a : '../../logs');
                const pm2LogFolder = path_1.default.join(appLogFolder, 'pm2');
                const nginxLogFolder = (_b = process.env.NGINX_LOGS_ABSOLUTE_DIR_PATH) !== null && _b !== void 0 ? _b : '';
                const isAppLogDirExist = fs_1.default.existsSync(appLogFolder);
                if (isAppLogDirExist) {
                    const backupDirList = fs_1.default.readdirSync(appLogFolder).filter(file => 
                    //ignore pm2 directory
                    fs_1.default.lstatSync(path_1.default.join(appLogFolder, file)).isDirectory() &&
                        file !== 'pm2');
                    if (backupDirList.length > 0) {
                        backupDirList.forEach(dir => {
                            const folder = path_1.default.join(appLogFolder, dir);
                            const fileList = fs_1.default
                                .readdirSync(folder)
                                .filter(file => fs_1.default.lstatSync(path_1.default.join(folder, file)).isFile())
                                .map(file => ({
                                file: file,
                                mtime: fs_1.default.lstatSync(path_1.default.join(folder, file)).ctimeMs,
                            }))
                                .filter(file => file.mtime < filterTime);
                            for (const file of fileList) {
                                const qualifiedPath = `${folder}/${file.file}`;
                                fs_1.default.unlink(qualifiedPath, err => {
                                    if (err) {
                                        this.logger.error('LOG FILE DELETED: ERR>> ', err);
                                    }
                                });
                            }
                        });
                    }
                    const isPM2LogDirExist = fs_1.default.existsSync(pm2LogFolder);
                    this.logger.debug('PM2 LOG FILE', isPM2LogDirExist);
                    if (isPM2LogDirExist) {
                        const fileList = fs_1.default
                            .readdirSync(pm2LogFolder)
                            .filter(file => fs_1.default.lstatSync(path_1.default.join(pm2LogFolder, file)).isFile() &&
                            file.endsWith('.gz'))
                            .map(file => ({
                            file: file,
                            mtime: fs_1.default.lstatSync(path_1.default.join(pm2LogFolder, file)).ctimeMs,
                        }))
                            .filter(file => file.mtime < filterTime);
                        this.logger.debug('PM2 LOG FILE DETECTED', fileList === null || fileList === void 0 ? void 0 : fileList.length);
                        for (const file of fileList) {
                            const qualifiedPath = `${pm2LogFolder}/${file.file}`;
                            fs_1.default.unlink(qualifiedPath, err => {
                                if (err) {
                                    this.logger.error('PM2 LOG FILE DELETED: ERR>> ', err);
                                }
                            });
                        }
                    }
                    const isNGINXLogDirExist = fs_1.default.existsSync(nginxLogFolder);
                    this.logger.debug('NGINX LOG FILE', isNGINXLogDirExist);
                    if (isNGINXLogDirExist) {
                        const fileList = fs_1.default
                            .readdirSync(nginxLogFolder)
                            .filter(file => fs_1.default.lstatSync(path_1.default.join(nginxLogFolder, file)).isFile() &&
                            //filter out current log files
                            !file.endsWith('.log'))
                            .map(file => ({
                            file: file,
                            mtime: fs_1.default.lstatSync(path_1.default.join(nginxLogFolder, file)).ctimeMs,
                        }))
                            .filter(file => file.mtime < filterTime);
                        this.logger.debug('NGINX LOG FILE DETECTED', fileList === null || fileList === void 0 ? void 0 : fileList.length);
                        for (const file of fileList) {
                            const qualifiedPath = `${nginxLogFolder}/${file.file}`;
                            fs_1.default.unlink(qualifiedPath, err => {
                                if (err) {
                                    this.logger.error('NGINX LOG FILE DELETED: ERR>> ', err);
                                }
                            });
                        }
                    }
                }
                resolve();
            }
            catch (err) {
                reject(err);
            }
        })
            .then(_ => this.logger.debug('CLEAR_APP_LOGS', 'DONE'))
            .catch(error => this.logger.error('CLEAR_APP_LOGS', error));
    }
    clearTempImages(filterTime) {
        new Promise((resolve, reject) => {
            var _a;
            try {
                const tempImagesFolder = path_1.default.join(__dirname, '../../.sandbox');
                const isExist = fs_1.default.existsSync(tempImagesFolder);
                if (isExist) {
                    this.logger.debug('TEMP_IMAGES', tempImagesFolder, isExist);
                    const fileList = fs_1.default
                        .readdirSync(tempImagesFolder)
                        .filter(file => fs_1.default.lstatSync(path_1.default.join(tempImagesFolder, file)).isFile())
                        .map(file => ({
                        file: file,
                        mtime: fs_1.default.lstatSync(path_1.default.join(tempImagesFolder, file)).ctimeMs,
                    }))
                        .filter(file => file.mtime < filterTime);
                    for (const file of fileList) {
                        const qualifiedPath = `${tempImagesFolder}/${file.file}`;
                        fs_1.default.unlink(qualifiedPath, err => {
                            if (err) {
                                this.logger.error('FILE DELETED: ERR>> ', err);
                            }
                        });
                    }
                    resolve((_a = fileList === null || fileList === void 0 ? void 0 : fileList.length) !== null && _a !== void 0 ? _a : 0);
                }
                else {
                    this.logger.debug('TEMP_IMAGES', isExist);
                    resolve(0);
                }
            }
            catch (err) {
                reject(err);
            }
        })
            .then(count => this.logger.debug('CLEAR_TEMP', count))
            .catch(error => this.logger.error('CLEAR_TEMP', error));
    }
};
ClearTempService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__param(0, (0, core_1.service)(console_logger_service_1.ConsoleLoggerService)),
    tslib_1.__param(1, (0, core_1.service)(cron_job_service_1.CronJobService)),
    tslib_1.__metadata("design:paramtypes", [console_logger_service_1.ConsoleLoggerService,
        cron_job_service_1.CronJobService])
], ClearTempService);
exports.ClearTempService = ClearTempService;
//# sourceMappingURL=clear-temp.service.js.map