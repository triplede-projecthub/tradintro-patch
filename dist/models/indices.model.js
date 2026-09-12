"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indices = void 0;
const tslib_1 = require("tslib");
const repository_1 = require("@loopback/repository");
let Indices = class Indices extends repository_1.Entity {
    constructor(data) {
        super(data);
    }
    getCurrentPrice() {
        var _a, _b;
        const value = (((_a = this.indices_high) !== null && _a !== void 0 ? _a : 0) + ((_b = this.indices_low) !== null && _b !== void 0 ? _b : 0)) / 2;
        return this.limitDecimalPoints(value);
    }
    getCurrentPriceDiff() {
        var _a, _b, _c;
        const value = ((((_a = this.indices_high) !== null && _a !== void 0 ? _a : 0) + ((_b = this.indices_low) !== null && _b !== void 0 ? _b : 0)) / 2) - ((_c = this.indices_open) !== null && _c !== void 0 ? _c : 0);
        return this.limitDecimalPoints(value);
    }
    getCurrentPriceDiffPer() {
        var _a, _b, _c, _d;
        const value = ((((_a = this.indices_high) !== null && _a !== void 0 ? _a : 0) + ((_b = this.indices_low) !== null && _b !== void 0 ? _b : 0)) / 2) - ((_c = this.indices_open) !== null && _c !== void 0 ? _c : 0);
        if (this.indices_open === 0)
            return 0;
        const perChange = (value / ((_d = this.indices_open) !== null && _d !== void 0 ? _d : 0)) * 100;
        return this.limitDecimalPoints(perChange);
    }
    prepareForResponse() {
        this.currentPrice = this.getCurrentPrice();
        this.currentPriceDiff = this.getCurrentPriceDiff();
        this.currentPriceDiffPer = this.getCurrentPriceDiffPer();
    }
    limitDecimalPoints(amount, limit = 3) {
        //return Math.trunc(amount * Math.pow(10, 2)) / Math.pow(10, 2);
        return this.roundNumberV1(+amount.toFixed(limit), 2);
    }
    roundNumberV1(num, scale) {
        if (!("" + num).includes("e")) {
            return +(Math.round(+(num + "e+" + scale)) + "e-" + scale);
        }
        else {
            const arr = ("" + num).split("e");
            let sig = "";
            if (+arr[1] + scale > 0) {
                sig = "+";
            }
            const i = +arr[0] + "e" + sig + (+arr[1] + scale);
            const j = Math.round(+i);
            const k = +(j + "e-" + scale);
            return k;
        }
    }
};
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        id: true,
        generated: true,
    }),
    tslib_1.__metadata("design:type", Number)
], Indices.prototype, "indices_id", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Indices.prototype, "indices_name", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'string',
        required: true,
    }),
    tslib_1.__metadata("design:type", String)
], Indices.prototype, "indices_code", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Indices.prototype, "indices_open", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Indices.prototype, "indices_close", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Indices.prototype, "indices_high", void 0);
tslib_1.__decorate([
    (0, repository_1.property)({
        type: 'number',
        default: 0,
    }),
    tslib_1.__metadata("design:type", Number)
], Indices.prototype, "indices_low", void 0);
Indices = tslib_1.__decorate([
    (0, repository_1.model)({
        name: 'indices',
    }),
    tslib_1.__metadata("design:paramtypes", [Object])
], Indices);
exports.Indices = Indices;
//# sourceMappingURL=indices.model.js.map