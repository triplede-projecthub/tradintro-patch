"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IndicesService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const repositories_1 = require("../repositories");
let IndicesService = class IndicesService {
    constructor(indicesRepository) {
        this.indicesRepository = indicesRepository;
    }
    async count(where) {
        return this.indicesRepository.count(where);
    }
    async find(filter) {
        return this.indicesRepository.find(filter);
    }
    async findById(id, filter) {
        return this.indicesRepository.findById(id, filter);
    }
};
IndicesService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.IndicesRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.IndicesRepository])
], IndicesService);
exports.IndicesService = IndicesService;
//# sourceMappingURL=indices.service.js.map