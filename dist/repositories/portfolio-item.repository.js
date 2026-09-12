"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortfolioItemRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let PortfolioItemRepository = class PortfolioItemRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, marketRepositoryGetter, notificationsRepositoryGetter) {
        super(models_1.PortfolioItem, dataSource);
        this.marketRepositoryGetter = marketRepositoryGetter;
        this.notificationsRepositoryGetter = notificationsRepositoryGetter;
        this.market = this.createHasOneRepositoryFactoryFor('market', marketRepositoryGetter);
        this.registerInclusionResolver('market', this.market.inclusionResolver);
        this.alert = this.createHasOneRepositoryFactoryFor('alert', notificationsRepositoryGetter);
        this.registerInclusionResolver('alert', this.alert.inclusionResolver);
    }
};
PortfolioItemRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__param(1, repository_1.repository.getter('MarketRepository')),
    tslib_1.__param(2, repository_1.repository.getter('NotificationsRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource, Function, Function])
], PortfolioItemRepository);
exports.PortfolioItemRepository = PortfolioItemRepository;
//# sourceMappingURL=portfolio-item.repository.js.map