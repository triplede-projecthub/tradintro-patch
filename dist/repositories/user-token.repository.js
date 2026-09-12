"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserTokenRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let UserTokenRepository = class UserTokenRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.UserToken, dataSource);
    }
};
UserTokenRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource])
], UserTokenRepository);
exports.UserTokenRepository = UserTokenRepository;
//# sourceMappingURL=user-token.repository.js.map