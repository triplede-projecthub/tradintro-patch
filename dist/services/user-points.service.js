"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPointsService = void 0;
const tslib_1 = require("tslib");
/* eslint-disable @typescript-eslint/naming-convention */
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const repositories_1 = require("../repositories");
const constants_1 = require("../utils/constants");
let UserPointsService = class UserPointsService {
    constructor(userPointsRepository, userLevelPointsRepository, userRepository) {
        this.userPointsRepository = userPointsRepository;
        this.userLevelPointsRepository = userLevelPointsRepository;
        this.userRepository = userRepository;
    }
    deleteAllUserPoints(userId) {
        return this.userPointsRepository.deleteAll({
            points_user_id: userId
        });
    }
    userLevelPointTotalForType(user_id, pointType, userLevel) {
        if (!user_id || user_id == undefined) {
            throw (new rest_1.HttpErrors.BadRequest());
        }
        return new Promise((resolve, reject) => {
            const query = "select sum(total_points) as total_points FROM user_points where points_user_id = " + user_id +
                " and points_type=\"" + pointType + "\" and	points_user_level =" + userLevel;
            this.userPointsRepository.execute(query).then((result) => {
                result = JSON.parse(JSON.stringify(result));
                if (result && result.length > 0) {
                    resolve(+(result[0].total_points));
                }
                else {
                    resolve(0);
                }
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
    async createUserLevel(userId, type) {
        const levels = await this.userLevelPointsRepository.find();
        await constants_1.DynamicValues.loadPointsSystem(levels);
        const levelsObj = constants_1.DynamicValues.POINT_SYSTEM.LEVELS;
        const points = levelsObj['1'].LOGIN;
        const totalValue = 1;
        return this.userPointsRepository.create({
            points_user_id: userId,
            points_type: type,
            points_user_level: 1,
            points_date: this._convertUTCDateToLocalDate(new Date()),
            points_per_unit: points.POINT_PER_UNIT,
            unit: points.UNIT,
            total_value: totalValue,
            total_points: (totalValue / points.UNIT) * points.POINT_PER_UNIT
        });
    }
    _convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }
    handleUserPoint(userId, type, userLevel, value = 1) {
        new Promise(async (resolve, reject) => {
            try {
                const levels = await this.userLevelPointsRepository.find();
                await constants_1.DynamicValues.loadPointsSystem(levels);
                let newPoints = 0;
                const currentPoints = await this.userLevelPointTotalForType(userId, type, userLevel);
                console.log("USER LEVEL", userLevel);
                console.log("POINT UNIT CURRENT", currentPoints);
                const adjustedUserLevel = userLevel > 1 ? 2 : 1;
                console.log("POINT AD USR LVL", currentPoints);
                const userLevelsKey = adjustedUserLevel.toString();
                const LEVELS_OBJECT = constants_1.DynamicValues.POINT_SYSTEM.LEVELS[userLevelsKey];
                const pointTypesKey = type.toLocaleUpperCase().toString();
                const POINT_TYPES_OBJECT = LEVELS_OBJECT[pointTypesKey];
                if (pointTypesKey == 'LOGIN') {
                    //check last point date
                    const startDate = this._convertUTCDateToLocalDate(new Date());
                    startDate.setUTCHours(0, 0, 0, 0);
                    const endDate = this._convertUTCDateToLocalDate(new Date());
                    endDate.setUTCHours(23, 59, 59, 999);
                    const point = await this.userPointsRepository.findOne({
                        where: {
                            points_date: {
                                between: [startDate, endDate]
                            },
                            points_user_id: userId,
                            //points_user_level: userLevel,
                            points_type: type,
                        }
                    });
                    if (point) {
                        throw new Error("Login point cap per day exceeded.");
                        return;
                    }
                }
                const pointPerUnitKey = 'POINT_PER_UNIT';
                const unitKey = 'UNIT';
                const maxUnitKey = 'MAX_POINTS';
                const pointPerUnitValue = POINT_TYPES_OBJECT[pointPerUnitKey];
                const unitValue = POINT_TYPES_OBJECT[unitKey];
                const maxUnitValue = POINT_TYPES_OBJECT[maxUnitKey];
                console.log("POINT UNIT MAX", maxUnitValue);
                console.log("POINT UNIT VALUE", unitValue);
                console.log("POINT UNIT POINT", pointPerUnitValue);
                if (currentPoints < maxUnitValue) {
                    let total_points = (value / unitValue) *
                        pointPerUnitValue;
                    const temp_point = (currentPoints + total_points);
                    console.log("POINT TEMP POINT", temp_point);
                    if (temp_point > maxUnitValue) {
                        newPoints = maxUnitValue - currentPoints;
                    }
                    else {
                        newPoints = total_points;
                    }
                }
                console.log("POINT NEW POINT", newPoints);
                if (newPoints > 0) {
                    const points = await this.userPointsRepository.create({
                        points_date: this._convertUTCDateToLocalDate(new Date()),
                        points_user_id: userId,
                        points_per_unit: pointPerUnitValue,
                        points_user_level: userLevel,
                        points_type: type,
                        unit: unitValue,
                        total_value: value,
                        total_points: newPoints
                    });
                    console.log("POINT UNIT", points);
                }
                else {
                    console.log("POINT UNIT: " + type, "EXCEEDED");
                }
                await this.checkAndUpdateUserLevel(userId, userLevel);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        }).then(() => {
            console.log("POINT UPDATE DONE : " + type);
        }).catch((err) => {
            console.log("POINT UPDATE ERROR : " + type, err);
        });
    }
    async checkAndUpdateUserLevel(userId, userLevel) {
        const userLevelObj = await this.findUserLevel(await this.userTotalPoints(userId));
        console.log(userLevelObj);
        if (userLevelObj.level_position > userLevel) {
            await this.userRepository.updateById(userId, {
                tree_level: userLevelObj.level_position
            });
        }
    }
    userTotalPoints(user_id) {
        if (!user_id || user_id == undefined) {
            throw (new rest_1.HttpErrors.BadRequest());
        }
        return new Promise((resolve, reject) => {
            const query = "select sum(total_points) as total_points FROM user_points where points_user_id = " + user_id;
            this.userPointsRepository.execute(query).then((result) => {
                const data = result; //.toString().replace(/RowDataPacket/g, 'RowDataPacket:');
                result = JSON.parse(JSON.stringify(result));
                if (result && result.length > 0) {
                    resolve(+(result[0].total_points));
                }
                else {
                    resolve(0);
                }
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
    findUserLevel(user_points = 0) {
        return new Promise((resolve, reject) => {
            this.userLevelPointsRepository.find({
                order: ['level_position ASC']
            }).then((results) => {
                for (let i = 0, l = results.length; i < l; i++) {
                    const lower = results[i].user_level_points;
                    if (user_points == lower) {
                        resolve(results[i]);
                    }
                    else if (user_points > lower) {
                        if (i + 1 == results.length) {
                            resolve(results[i]);
                        }
                        else {
                            const higher = results[i + 1].user_level_points - 1;
                            if (user_points <= higher) {
                                resolve(results[i]);
                            }
                        }
                    }
                }
            }).catch((err) => {
                console.log(err);
                reject(err);
            });
        });
    }
};
UserPointsService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(repositories_1.UserPointsRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(repositories_1.UserLevelPointsRepository)),
    tslib_1.__param(2, (0, repository_1.repository)(repositories_1.UserRepository)),
    tslib_1.__metadata("design:paramtypes", [repositories_1.UserPointsRepository,
        repositories_1.UserLevelPointsRepository,
        repositories_1.UserRepository])
], UserPointsService);
exports.UserPointsService = UserPointsService;
//# sourceMappingURL=user-points.service.js.map