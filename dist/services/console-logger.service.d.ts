export declare class ConsoleLoggerService {
    constructor();
    private _handlePrint;
    /**
     * @description Print information level messages.
     * avoid sensitive information.
     * @author George Joseph
     * @date 26/11/2021
     * @param {string} tag
     * @param {any|any[]} messages
     * @memberof ConsoleLoggerService
     */
    info(tag: string, ...messages: any): void;
    /**
     * @description Print debug and info level messages.
     * @author George Joseph
     * @date 26/11/2021
     * @param {string} tag
     * @param {any|any[]} messages
     * @memberof ConsoleLoggerService
     */
    debug(tag: string, ...messages: any): void;
    /**
     * @description Print
     * @author George Joseph
     * @date 26/11/2021
     * @param {string} tag
     * @param {any|any[]} messages
     * @memberof ConsoleLoggerService
     */
    error(tag: string, ...messages: any): void;
    warning(tag: string, ...messages: any): void;
    private levelLabel;
}
