"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const datasources_1 = require("../datasources");
let DBHealthCheckProvider = class DBHealthCheckProvider {
    constructor(ds) {
        this.ds = ds;
    }
    value() {
        return () => this.ds.ping();
    }
};
DBHealthCheckProvider = tslib_1.__decorate([
    tslib_1.__param(0, (0, context_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource])
], DBHealthCheckProvider);
exports.default = DBHealthCheckProvider;
//# sourceMappingURL=DBHealthCheckProvider.js.map