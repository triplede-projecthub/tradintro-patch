"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HolidaysRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const models_1 = require("../models");
let HolidaysRepository = class HolidaysRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(models_1.Holidays, dataSource);
    }
};
HolidaysRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource])
], HolidaysRepository);
exports.HolidaysRepository = HolidaysRepository;
//# sourceMappingURL=holidays.repository.js.map