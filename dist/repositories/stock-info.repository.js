"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockInfoRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let StockInfoRepository = class StockInfoRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.StockInfo, dataSource);
    }
};
StockInfoRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource])
], StockInfoRepository);
exports.StockInfoRepository = StockInfoRepository;
//# sourceMappingURL=stock-info.repository.js.map