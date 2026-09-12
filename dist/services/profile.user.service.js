"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileUserService = void 0;
const tslib_1 = require("tslib");
const core_1 = require("@loopback/core");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const security_1 = require("@loopback/security");
const crypto_1 = tslib_1.__importDefault(require("crypto"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const login_response_data_model_1 = require("../models/dto/login-response-data.model");
const repositories_1 = require("../repositories");
const deleted_user_repository_1 = require("../repositories/deleted-user.repository");
const tax_repository_1 = require("../repositories/tax.repository");
const user_repository_1 = require("../repositories/user.repository");
const constants_1 = require("../utils/constants");
const keys_1 = require("../utils/keys");
const jwt_service_1 = require("./jwt.service");
const password_hasher_service_1 = require("./password-hasher.service");
const user_points_service_1 = require("./user-points.service");
const user_token_service_1 = require("./user-token.service");
const validations_service_1 = require("./validations.service");
let ProfileUserService = class ProfileUserService {
    constructor(userRepository, deletedUserRepository, userPointsService, userTokenService, hasher, jwtServiceUtils, validator, walletRepository, watchListRepository, portfolioRepository, userInviteRepository, notificationsRepository, taxRepository) {
        this.userRepository = userRepository;
        this.deletedUserRepository = deletedUserRepository;
        this.userPointsService = userPointsService;
        this.userTokenService = userTokenService;
        this.hasher = hasher;
        this.jwtServiceUtils = jwtServiceUtils;
        this.validator = validator;
        this.walletRepository = walletRepository;
        this.watchListRepository = watchListRepository;
        this.portfolioRepository = portfolioRepository;
        this.userInviteRepository = userInviteRepository;
        this.notificationsRepository = notificationsRepository;
        this.taxRepository = taxRepository;
    }
    getTaxDetails(userId) {
        return this.taxRepository.find({
            where: {
                tax_status: 1
            },
            order: ['tax_id ASC']
        });
    }
    async deleteUserAccount(userId) {
        try {
            const user = await this.userRepository.findById(userId);
            // delete user (hard delete)
            await this.userRepository.deleteById(userId);
            await this.deletedUserRepository.create({
                delete_user_email: user.user_email,
                delete_user_id: user.user_id,
                delete_user_name: user.user_name
            });
            try {
                // delete notifications for user
                await this.notificationsRepository.deleteAll({
                    notification_user_id: userId
                });
                // delete portfolio (order_list)
                await this.portfolioRepository.deleteAll({
                    order_user_id: userId
                });
                // delete user_points
                await this.userPointsService.deleteAllUserPoints(userId);
                //delete user_token
                await this.userTokenService.deleteAllUserTokens(userId);
                //delete watchlist
                await this.watchListRepository.deleteAll({
                    watchlist_user_id: userId
                });
            }
            catch (err) {
                console.log("DELETE USER OTHER DATA FAILED", err.message);
            }
        }
        catch (err) {
            throw new rest_1.HttpErrors.BadRequest("Invalid request");
        }
        return { count: 1 };
    }
    async updateUserBasicInfo(request, userId) {
        try {
            const user = await this.userRepository.findOne({
                where: {
                    user_id: userId
                }
            });
            if (user) {
                let lastImage;
                let user_image;
                const files = request.files;
                for (const file of files) {
                    if (file.fieldname === 'image') {
                        console.log(file);
                        //if (SupportedFilesInfo.mimeTypes.images.includes(file.mimetype)) {
                        lastImage = user.user_image + "";
                        user_image = `avatar/${file.filename}`;
                        user.user_image = user_image;
                        console.log("New Avatar Image", user.user_image);
                        /*  } else {
                           throw new HttpErrors.BadRequest('Invalid image file.');
                         } */
                    }
                }
                const body = request.body;
                if (body) {
                    console.log(body);
                    for (const key in body) {
                        console.log(key);
                        if (["user_name", 'user_last_name', 'user_phone'].includes(key)) {
                            if (body[key] && body[key].length > 0) {
                                user[key] = body[key];
                            }
                            else {
                                delete body[key];
                            }
                        }
                        else {
                            delete body[key];
                            console.log("not set");
                        }
                    }
                }
                if (user_image) {
                    body["user_image"] = user_image;
                }
                console.log("data to update", body);
                await this.userRepository.updateById(userId, body);
                this.deleteImageFile(lastImage);
                return user;
            }
            else {
                throw new rest_1.HttpErrors.BadRequest('User not found.');
            }
        }
        catch (err) {
            console.error("Image upload error", err);
            throw new rest_1.HttpErrors.InternalServerError(err.message);
        }
    }
    deleteImageFile(lastImage) {
        if (lastImage && process.env.FILE_STORAGE_PATH) {
            console.log("file unlink", lastImage);
            fs_1.default.unlink(`${process.env.FILE_STORAGE_PATH}/${lastImage}`, (e) => {
                if (e) {
                    console.log("file unlink error", e);
                }
            });
        }
    }
    findUserInviteList(userId, limit, offset) {
        return this.userInviteRepository.find({
            where: {
                invite_from: userId.toString()
            },
            limit: limit,
            offset: offset,
            order: ['invite_date DESC'],
        });
    }
    userFcmUpdate(userId, fcmTokenChangeRequest) {
        return this.userTokenService.updateUserFcmToken(userId, fcmTokenChangeRequest);
    }
    userTotalPoints(user_id) {
        return this.userPointsService.userTotalPoints(user_id);
    }
    async verifyCredentials(credentials) {
        const foundUserLogin = await this.userRepository.findOne({
            where: {
                user_email: credentials.username
            }
        });
        if (!foundUserLogin || foundUserLogin.user_password === undefined) {
            throw new rest_1.HttpErrors.Unauthorized('user not found');
        }
        const passwordMatched = await this.hasher.comparePassword(credentials.password, foundUserLogin.user_password);
        if (!passwordMatched)
            throw new rest_1.HttpErrors.Unauthorized('password is not valid');
        return foundUserLogin;
    }
    convertToUserProfile(user) {
        return {
            [security_1.securityId]: user.user_id.toString(),
            name: user.user_name,
            id: user.user_id,
            type: 'admin',
            username: user.user_email
        };
    }
    findById(id) {
        return this.userRepository.findOne({
            where: {
                user_id: id,
                user_status: {
                    inq: [0, 1]
                }
            },
            include: [{
                    relation: 'userLevel'
                }]
        });
    }
    userLogout(userId, fcmTokenChangeRequest) {
        return new Promise(async (resolve, reject) => {
            try {
                await this.userTokenService.deleteUserFcmToken(userId, fcmTokenChangeRequest);
                this.userRepository.updateById(userId, {
                    user_logout_time: Date()
                })
                    .then(() => { }).catch((e) => {
                    console.log("Logout -> update logout time", e);
                });
                resolve();
            }
            catch (err) {
                reject(err);
            }
        });
    }
    userLogin(login) {
        console.log(login);
        if (!login || login == undefined
            || !login.username || !login.password) {
            throw (new rest_1.HttpErrors.Unauthorized("Incorrect email id or password."));
        }
        return new Promise((resolve, reject) => {
            this.userRepository.findOne({
                where: {
                    user_email: login.username,
                    user_status: {
                        inq: [0, 1]
                    }
                },
                include: [{
                        relation: 'userLevel'
                    }]
            }).then(async (user) => {
                var _a, _b, _c, _d, _e, _f, _g, _h;
                if (user == null || user == undefined) {
                    reject(new rest_1.HttpErrors.Unauthorized("Error! User account does not exist")); // TI24-0208-001
                }
                else {
                    const passwordMD5 = crypto_1.default.createHash('md5').update(login.password).digest("hex");
                    ;
                    if (passwordMD5 != user.user_password) {
                        reject(new rest_1.HttpErrors.Unauthorized("Incorrect email id or password."));
                    }
                    if (user.user_status == 0) {
                        resolve(new login_response_data_model_1.LoginResponseData({ token: '', refresh_token: '' }));
                        return;
                    }
                    const profile = this.jwtServiceUtils.createTokenProfile({
                        id: ((_a = user.user_id) !== null && _a !== void 0 ? _a : '') + '',
                        clientId: ((_b = user.user_id) !== null && _b !== void 0 ? _b : '') + '',
                        moduleId: '',
                    });
                    const key = await this.jwtServiceUtils.generateToken(profile);
                    const refreshKey = await this.jwtServiceUtils.generateRefreshToken(profile);
                    /*     this.userPointsService.handleLoginUserPoint(+(user?.user_id ?? 0),
                          user?.userLevel?.level_position ?? 1) */
                    if (!(user === null || user === void 0 ? void 0 : user.userLevel)) {
                        await this.userPointsService.createUserLevel(+((_c = user === null || user === void 0 ? void 0 : user.user_id) !== null && _c !== void 0 ? _c : 0), constants_1.DynamicValues.POINT_SYSTEM.TYPES.LOGIN);
                    }
                    const currentUserLevel = (_e = (_d = user === null || user === void 0 ? void 0 : user.userLevel) === null || _d === void 0 ? void 0 : _d.level_position) !== null && _e !== void 0 ? _e : 1;
                    console.log(currentUserLevel);
                    console.log(user);
                    const date = new Date();
                    const adjustedDate = this._convertUTCDateToLocalDate(date);
                    console.log("ORG DATE", date);
                    console.log("ADJ DATE", adjustedDate);
                    this.userRepository.updateById(+((_f = user === null || user === void 0 ? void 0 : user.user_id) !== null && _f !== void 0 ? _f : 0), {
                        user_login_time: adjustedDate,
                        user_login_count: ((_g = user === null || user === void 0 ? void 0 : user.user_login_count) !== null && _g !== void 0 ? _g : 0) + 1,
                        daily_login_status: 1,
                    }).then(() => { }).catch((e) => {
                        console.log("Login -> Update Last Login", e);
                    });
                    this.userPointsService.handleUserPoint(+((_h = user === null || user === void 0 ? void 0 : user.user_id) !== null && _h !== void 0 ? _h : 0), constants_1.DynamicValues.POINT_SYSTEM.TYPES.LOGIN, currentUserLevel);
                    resolve(new login_response_data_model_1.LoginResponseData({ token: key, refresh_token: refreshKey }));
                }
            });
        });
    }
    _convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        return newDate;
    }
    userLoginPasswordChange(userId, passwordRequest) {
        if (!passwordRequest || passwordRequest == undefined
            || !passwordRequest.currentPassword || !passwordRequest.newPassword ||
            passwordRequest.newPassword.length < 5) {
            throw (new rest_1.HttpErrors.BadRequest("Invalid params."));
        }
        return new Promise((resolve, reject) => {
            const currentPassword = crypto_1.default.createHash('md5')
                .update(passwordRequest.currentPassword).digest("hex");
            this.userRepository.findOne({
                where: {
                    user_id: userId,
                    user_password: currentPassword,
                }
            }).then(async (user) => {
                var _a, _b;
                if (user === null) {
                    reject(new rest_1.HttpErrors.Unauthorized("Invalid credentials."));
                }
                else {
                    try {
                        const newPassword = crypto_1.default.createHash('md5')
                            .update(passwordRequest.newPassword).digest("hex");
                        ;
                        if (newPassword === currentPassword) {
                            reject(new rest_1.HttpErrors.BadRequest("Your new password cannot be same as old password")); // TI24-0203-002
                            return;
                        }
                        user.user_password = newPassword;
                        await this.userRepository.update(user);
                        const profile = this.jwtServiceUtils.createTokenProfile({
                            id: ((_a = user.user_id) !== null && _a !== void 0 ? _a : '') + '',
                            clientId: ((_b = user.user_id) !== null && _b !== void 0 ? _b : '') + '',
                            moduleId: '',
                        });
                        const key = await this.jwtServiceUtils.generateToken(profile);
                        const refreshKey = await this.jwtServiceUtils.generateRefreshToken(profile);
                        resolve(new login_response_data_model_1.LoginResponseData({ token: key, refresh_token: refreshKey }));
                    }
                    catch (error) {
                        reject(error);
                    }
                }
            });
        });
    }
    userTotalWalletAmount(user_id) {
        if (!user_id || user_id == undefined) {
            throw (new rest_1.HttpErrors.BadRequest());
        }
        return new Promise((resolve, reject) => {
            const query = "select sum(wallet_money) as total_amount FROM wallet where wallet_user_id = " + user_id;
            this.walletRepository.execute(query).then((result) => {
                const data = result; //.toString().replace(/RowDataPacket/g, 'RowDataPacket:');
                result = JSON.parse(JSON.stringify(result));
                if (result && result.length > 0) {
                    resolve(+(result[0].total_amount));
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
    userTotalTradValue(user_id) {
        if (!user_id || user_id == undefined) {
            throw (new rest_1.HttpErrors.BadRequest());
        }
        return new Promise((resolve, reject) => {
            const query = "select sum(wallet_trade_value) as total_value FROM wallet where wallet_user_id = " + user_id;
            this.walletRepository.execute(query).then((result) => {
                const data = result; //.toString().replace(/RowDataPacket/g, 'RowDataPacket:');
                result = JSON.parse(JSON.stringify(result));
                if (result && result.length > 0) {
                    resolve(+(result[0].total_value));
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
    userTotalInvestments(user_id) {
        if (!user_id || user_id == undefined) {
            throw (new rest_1.HttpErrors.BadRequest());
        }
        return new Promise((resolve, reject) => {
            const query = "SELECT sum(order_total) as total_investment,sum(margin_amount_used) as margin_amount FROM order_list where order_status in (0,1) and portfolio_status=0 and order_type=0 and order_user_id=" + user_id;
            this.portfolioRepository.execute(query).then((result) => {
                const data = result; //.toString().replace(/RowDataPacket/g, 'RowDataPacket:');
                result = JSON.parse(JSON.stringify(result));
                if (result && result.length > 0) {
                    resolve((+(result[0].total_investment) + +(result[0].margin_amount)));
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
};
ProfileUserService = tslib_1.__decorate([
    (0, core_1.injectable)({ scope: core_1.BindingScope.TRANSIENT }),
    tslib_1.__param(0, (0, repository_1.repository)(user_repository_1.UserRepository)),
    tslib_1.__param(1, (0, repository_1.repository)(deleted_user_repository_1.DeletedUserRepository)),
    tslib_1.__param(2, (0, core_1.service)(user_points_service_1.UserPointsService)),
    tslib_1.__param(3, (0, core_1.service)(user_token_service_1.UserTokenService)),
    tslib_1.__param(4, (0, core_1.inject)(keys_1.PasswordHasherBindings.PASSWORD_HASHER)),
    tslib_1.__param(5, (0, core_1.inject)(keys_1.TokenServiceBindings.TOKEN_SERVICE)),
    tslib_1.__param(6, (0, core_1.service)(validations_service_1.ValidationsService)),
    tslib_1.__param(7, (0, repository_1.repository)(repositories_1.WalletRepository)),
    tslib_1.__param(8, (0, repository_1.repository)(repositories_1.WatchListRepository)),
    tslib_1.__param(9, (0, repository_1.repository)(repositories_1.PortfolioItemRepository)),
    tslib_1.__param(10, (0, repository_1.repository)(repositories_1.UserInviteRepository)),
    tslib_1.__param(11, (0, repository_1.repository)(repositories_1.NotificationsRepository)),
    tslib_1.__param(12, (0, repository_1.repository)(tax_repository_1.TaxRepository)),
    tslib_1.__metadata("design:paramtypes", [user_repository_1.UserRepository,
        deleted_user_repository_1.DeletedUserRepository,
        user_points_service_1.UserPointsService,
        user_token_service_1.UserTokenService,
        password_hasher_service_1.BCryptPasswordHasherService,
        jwt_service_1.JWTServiceUtils,
        validations_service_1.ValidationsService,
        repositories_1.WalletRepository,
        repositories_1.WatchListRepository,
        repositories_1.PortfolioItemRepository,
        repositories_1.UserInviteRepository,
        repositories_1.NotificationsRepository,
        tax_repository_1.TaxRepository])
], ProfileUserService);
exports.ProfileUserService = ProfileUserService;
//# sourceMappingURL=profile.user.service.js.map