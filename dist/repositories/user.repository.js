"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let UserRepository = class UserRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource, userLevelPointsRepository) {
        super(models_1.User, dataSource);
        this.userLevelPointsRepository = userLevelPointsRepository;
        this.userLevel = this.createHasOneRepositoryFactoryFor('userLevel', userLevelPointsRepository);
        this.registerInclusionResolver('userLevel', this.userLevel.inclusionResolver);
    }
};
UserRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__param(1, repository_1.repository.getter('UserLevelPointsRepository')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource, Function])
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map