"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserLevelService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const user_levels_response_model_1 = require("../models/dto/user-levels-response.model");
const repositories_1 = require("../repositories");
const user_points_service_1 = require("./user-points.service");
let UserLevelService = class UserLevelService {
    constructor(userPointsService, userRepository, userPointsRepository, userLevelPointsRepository) {
        this.userPointsService = userPointsService;
        this.userRepository = userRepository;
        this.userPointsRepository = userPointsRepository;
        this.userLevelPointsRepository = userLevelPointsRepository;
    }
    getUserLevels(userId) {
        return new Promise(async (resolve, reject) => {
            var _a;
            try {
                const response = new user_levels_response_model_1.UserLevelsResponse();
                response.myPoints = await this.userPointsService.userTotalPoints(userId);
                const user = await this.userRepository.findOne({
                    where: {
                        user_id: userId
                    }
                });
                if (user) {
                    response.myLevel = (_a = user.tree_level) !== null && _a !== void 0 ? _a : 1;
                }
                else {
                    response.myLevel = 1;
                }
                response.levels = await this.userLevelPointsRepository.find();
                if (response.levels) {
                    for (const level of response.levels) {
                        if (level.level_position <= response.myLevel) {
                            const query = "select sum(total_points) as total_points FROM user_points where points_user_id = " + userId +
                                " and	points_user_level =" + level.level_position;
                            try {
                                let response = await this.userLevelPointsRepository.execute(query);
                                response = JSON.parse(JSON.stringify(response));
                                if (response && response.length > 0) {
                                    level.totalEarnedPointsByUser = +(response[0].total_points);
                                }
                            }
                            catch (err) {
                                //ignore
                                console.log(err);
                            }
                        }
                    }
                }
                resolve(response);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getUserPointsHistory(userId, limit, offset) {
        return this.userPointsRepository.find({
            where: {
                points_user_id: userId,
                total_points: {
                    gt: 0
                }
            },
            limit: limit,
            offset: offset,
            order: ['points_date DESC'],
        });
    }
};
UserLevelService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, core_1.service)(user_points_service_1.UserPointsService)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.UserRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.UserPointsRepository)),
    tslib_1.__param(3, (0, repository_1.repository)(repositories_1.UserLevelPointsRepository)),
    tslib_1.__metadata("design:paramtypes", [user_points_service_1.UserPointsService,
        repositories_1.UserRepository,
        repositories_1.UserPointsRepository,
        repositories_1.UserLevelPointsRepository])
], UserLevelService);
exports.UserLevelService = UserLevelService;
//# sourceMappingURL=user-level.service.js.map