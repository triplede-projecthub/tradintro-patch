"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaxRepository = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const datasources_1 = require("../datasources");
const tax_model_1 = require("../models/tax.model");
let TaxRepository = class TaxRepository extends repository_1.DefaultCrudRepository {
    constructor(dataSource) {
        super(tax_model_1.Tax, dataSource);
    }
};
TaxRepository = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)('datasources.TradIntroMySQL')),
    tslib_1.__metadata("design:paramtypes", [datasources_1.TradIntroMySqlDataSource])
], TaxRepository);
exports.TaxRepository = TaxRepository;
//# sourceMappingURL=tax.repository.js.map