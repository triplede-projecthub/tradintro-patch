"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let NotificationsRepository = class NotificationsRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, marketRepositoryGetter) {
        super(models_1.Notifications, dataSource);
        this.marketRepositoryGetter = marketRepositoryGetter;
        this.market = this.createHasOneRepositoryFactoryFor('market', marketRepositoryGetter);
        this.registerInclusionResolver('market', this.market.inclusionResolver);
    }
};
NotificationsRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__param(1, repository_1.repository.getter('MarketRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource, Function])
], NotificationsRepository);
exports.NotificationsRepository = NotificationsRepository;
//# sourceMappingURL=notifications.repository.js.map