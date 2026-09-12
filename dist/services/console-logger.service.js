"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConsoleLoggerService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const constants_1 = require("../utils/constants");
class LoggerLevel {
}
LoggerLevel.NONE = 0;
LoggerLevel.DEBUG = 1;
LoggerLevel.INFO = 2;
LoggerLevel.WARNING = 3;
LoggerLevel.ERROR = 4;
LoggerLevel.ALL = 100;
let ConsoleLoggerService = class ConsoleLoggerService {
    constructor() { }
    _handlePrint(level, tag, ...messages) {
        new Promise(async (resolve, reject) => {
            const dataToPrint = await handleDataToPrint(messages);
            console.log(this.levelLabel(level), tag, new Date(), '>', dataToPrint);
            resolve();
        })
            .then(() => { })
            .catch(() => { });
    }
    /**
     * @description Print information level messages.
     * avoid sensitive information.
     * @author George Joseph
     * @date 26/11/2021
     * @param {string} tag
     * @param {any|any[]} messages
     * @memberof ConsoleLoggerService
     */
    info(tag, ...messages) {
        if (constants_1.DynamicValues.LoggerLevel >= LoggerLevel.INFO) {
            this._handlePrint('INFO', tag, messages);
        }
    }
    /**
     * @description Print debug and info level messages.
     * @author George Joseph
     * @date 26/11/2021
     * @param {string} tag
     * @param {any|any[]} messages
     * @memberof ConsoleLoggerService
     */
    debug(tag, ...messages) {
        if (constants_1.DynamicValues.LoggerLevel >= LoggerLevel.DEBUG) {
            this._handlePrint('DEBUG', tag, messages);
        }
    }
    /**
     * @description Print
     * @author George Joseph
     * @date 26/11/2021
     * @param {string} tag
     * @param {any|any[]} messages
     * @memberof ConsoleLoggerService
     */
    error(tag, ...messages) {
        if (constants_1.DynamicValues.LoggerLevel >= LoggerLevel.ERROR) {
            this._handlePrint('ERROR', tag, messages);
        }
    }
    warning(tag, ...messages) {
        if (constants_1.DynamicValues.LoggerLevel >= LoggerLevel.ERROR) {
            this._handlePrint('WARNING', tag, messages);
        }
    }
    levelLabel(level) {
        switch (level) {
            case 'ERROR':
                return '⛔ > ERROR';
            case 'WARNING':
                return '⚠️ > WARNING';
            case 'DEBUG':
                return '🐞 > DEBUG';
            default:
                return 'ⓘ > INFO';
        }
    }
};
ConsoleLoggerService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.SINGLETON }),
    tslib_1.__metadata("design:paramtypes", [])
], ConsoleLoggerService);
exports.ConsoleLoggerService = ConsoleLoggerService;
const handleDataToPrint = async (messages) => {
    if (Array.isArray(messages)) {
        const data = [];
        for (const message of messages) {
            data.push(await handleDataToPrint(message));
        }
        return data;
    }
    else {
        try {
            return JSON.stringify(messages);
        }
        catch (e) {
            return messages;
        }
    }
};
//# sourceMappingURL=console-logger.service.js.map