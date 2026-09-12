"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevelController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const user_level_service_1 = require("../services/user-level.service");
const security_spec_1 = require("../utils/security-spec");
const api_utils_1 = require("./api.utils");
const user_level_dto_1 = require("./dto/user-level.dto");
let UserLevelController = class UserLevelController {
    constructor(userLevelService, user) {
        this.userLevelService = userLevelService;
        this.user = user;
    }
    async getUserLevels() {
        return new Promise((resolve, reject) => {
            this.userLevelService.getUserLevels(+(this.user.id)).then((result) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async getUserLevelsHistory(limit = 10, offset = 0) {
        return new Promise((resolve, reject) => {
            this.userLevelService.getUserPointsHistory(+(this.user.id), limit, offset).then((result) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: result,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
};
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/user-levels', {
        description: 'Get all user levels and user level info.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': user_level_dto_1.USER_LEVEL_LIST_RESPONSE,
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserLevelController.prototype, "getUserLevels", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/user-points/history', {
        description: 'Get all user points history.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': user_level_dto_1.USER_POINTS_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(1, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserLevelController.prototype, "getUserLevelsHistory", null);
UserLevelController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(user_level_service_1.UserLevelService)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [user_level_service_1.UserLevelService, Object])
], UserLevelController);
exports.UserLevelController = UserLevelController;
//# sourceMappingURL=user-level.controller.js.map