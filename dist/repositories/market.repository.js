"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MarketRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let MarketRepository = class MarketRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, marketHistoryRepositoryGetter, watchListRepositoryGetter, portfolioItemRepositoryGetter, notificationsRepositoryGetter, stockInfoRepositoryGetter, indicesRepositoryGetter) {
        super(models_1.Market, dataSource);
        this.marketHistoryRepositoryGetter = marketHistoryRepositoryGetter;
        this.watchListRepositoryGetter = watchListRepositoryGetter;
        this.portfolioItemRepositoryGetter = portfolioItemRepositoryGetter;
        this.notificationsRepositoryGetter = notificationsRepositoryGetter;
        this.stockInfoRepositoryGetter = stockInfoRepositoryGetter;
        this.indicesRepositoryGetter = indicesRepositoryGetter;
        this.alert = this.createHasOneRepositoryFactoryFor('alert', notificationsRepositoryGetter);
        this.registerInclusionResolver('alert', this.alert.inclusionResolver);
        this.history = this.createHasManyRepositoryFactoryFor('history', marketHistoryRepositoryGetter);
        this.watchlist = this.createHasOneRepositoryFactoryFor('watchlist', watchListRepositoryGetter);
        this.stockInfo = this.createHasOneRepositoryFactoryFor('stockInfo', stockInfoRepositoryGetter);
        this.indices = this.createHasOneRepositoryFactoryFor('indices', indicesRepositoryGetter);
        this.portfolioItems = this.createHasManyRepositoryFactoryFor('portfolioItems', portfolioItemRepositoryGetter);
        this.registerInclusionResolver('indices', this.indices.inclusionResolver);
        this.registerInclusionResolver('history', this.history.inclusionResolver);
        this.registerInclusionResolver('watchlist', this.watchlist.inclusionResolver);
        this.registerInclusionResolver('stockInfo', this.stockInfo.inclusionResolver);
        this.registerInclusionResolver('portfolioItems', this.portfolioItems.inclusionResolver);
    }
};
MarketRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__param(1, repository_1.repository.getter('MarketHistoryRepository')),
    tslib_1.__param(2, repository_1.repository.getter('WatchListRepository')),
    tslib_1.__param(3, repository_1.repository.getter('PortfolioItemRepository')),
    tslib_1.__param(4, repository_1.repository.getter('NotificationsRepository')),
    tslib_1.__param(5, repository_1.repository.getter('StockInfoRepository')),
    tslib_1.__param(6, repository_1.repository.getter('IndicesRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource, Function, Function, Function, Function, Function, Function])
], MarketRepository);
exports.MarketRepository = MarketRepository;
//# sourceMappingURL=market.repository.js.map