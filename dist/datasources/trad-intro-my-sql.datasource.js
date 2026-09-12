"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradIntroMySqlDataSource = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const config = {
    name: 'TradIntroMySQL',
    connector: 'mysql',
};
let TradIntroMySqlDataSource = class TradIntroMySqlDataSource extends repository_1.juggler.DataSource {
    constructor(dsConfig = config) {
        _handleDbType(process.env.DB_CONNECTOR_NAME, dsConfig);
        super(dsConfig);
    }
};
TradIntroMySqlDataSource.dataSourceName = 'TradIntroMySQL';
TradIntroMySqlDataSource.defaultConfig = config;
TradIntroMySqlDataSource = tslib_1.__decorate([
    (0, core_1.lifeCycleObserver)('datasource'),
    tslib_1.__param(0, (0, core_1.inject)('datasources.config.TradIntroMySQL', { optional: true })),
    tslib_1.__metadata("design:paramtypes", [Object])
], TradIntroMySqlDataSource);
exports.TradIntroMySqlDataSource = TradIntroMySqlDataSource;
function _handleDbType(DB_CONNECTOR_NAME, dsConfig) {
    var _a, _b, _c;
    if (DB_CONNECTOR_NAME == 'mysql') {
        dsConfig.port = +((_a = process.env.DB_PORT) !== null && _a !== void 0 ? _a : 3306);
        dsConfig.password = (_b = process.env.DB_PASSWORD) !== null && _b !== void 0 ? _b : '';
    }
    Object.assign(dsConfig, {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        connector: DB_CONNECTOR_NAME !== null && DB_CONNECTOR_NAME !== void 0 ? DB_CONNECTOR_NAME : 'mysql',
        database: process.env.DB_DATABASE,
        lazyConnect: process.env.DB_CONNECTION_LAZY == 'true' ? true : false,
        connectionTimeout: +((_c = process.env.DB_CONNECTION_TIMEOUT) !== null && _c !== void 0 ? _c : 1800),
    });
    console.log("DB DETAILS", dsConfig);
}
//# sourceMappingURL=trad-intro-my-sql.datasource.js.map