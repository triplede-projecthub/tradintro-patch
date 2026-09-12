"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketHistoryRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let MarketHistoryRepository = class MarketHistoryRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, marketRepositoryGetter) {
        super(models_1.MarketHistory, dataSource);
        this.marketRepositoryGetter = marketRepositoryGetter;
    }
};
MarketHistoryRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__param(1, repository_1.repository.getter('MarketRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource, Function])
], MarketHistoryRepository);
exports.MarketHistoryRepository = MarketHistoryRepository;
//# sourceMappingURL=market-history.repository.js.map