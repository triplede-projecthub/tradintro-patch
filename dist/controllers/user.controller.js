"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const moment_1 = tslib_1.__importDefault(require("moment"));
const change_password_request_model_1 = require("../models/dto/change-password-request.model");
const dashboard_response_data_model_1 = require("../models/dto/dashboard-response-data.model");
const fcm_token_change_request_model_1 = require("../models/dto/fcm-token-change-request.model");
const user_login_model_1 = require("../models/dto/user-login.model");
const services_1 = require("../services");
const security_spec_1 = require("../utils/security-spec");
const api_utils_1 = require("./api.utils");
const users_dto_1 = require("./dto/users.dto");
let UserController = class UserController {
    constructor(userService, user) {
        this.userService = userService;
        this.user = user;
    }
    async updateBasicUserInfo(request) {
        return new Promise((resolve, reject) => {
            this.userService.updateUserBasicInfo(request, +(this.user.id)).then((user) => {
                if (user) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: user,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.BadRequest());
                }
            }).catch((error) => reject(error));
        });
    }
    async deleteUserAccount() {
        return new Promise((resolve, reject) => {
            this.userService.deleteUserAccount(+(this.user.id)).then((count) => {
                if (count) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: count,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.BadRequest());
                }
            }).catch((error) => reject(error));
        });
    }
    async findById() {
        return new Promise((resolve, reject) => {
            this.userService.findById(+(this.user.id)).then((user) => {
                if (user) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: user,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.BadRequest());
                }
            }).catch((error) => reject(error));
        });
    }
    async userLogin(login) {
        return new Promise((resolve, reject) => {
            this.userService.userLogin(login).then((loginResult) => {
                if (loginResult) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: loginResult,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.Unauthorized("Incorrect email id or password."));
                }
            }).catch((error) => reject(error));
        });
    }
    async userLoginPasswordChange(changePasswordRequest) {
        return new Promise((resolve, reject) => {
            this.userService.userLoginPasswordChange(+(this.user.id), changePasswordRequest).then((loginResult) => {
                if (loginResult && loginResult.token) {
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: loginResult,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.Unauthorized("Invalid credentials"));
                }
            }).catch((error) => reject(error));
        });
    }
    async findUserInviteList(limit = 10, offset = 0) {
        return new Promise((resolve, reject) => {
            this.userService.findUserInviteList(+(this.user.id), limit, offset).then((data) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: data,
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async userDashBoard() {
        return new Promise((resolve, reject) => {
            this.userService.findById(this.user.id).then(async (user) => {
                var _a, _b, _c;
                if (user && user.user_id) {
                    const dashboard = new dashboard_response_data_model_1.DashboardResponseData({ user_id: +(this.user.id) });
                    dashboard.current_points = await this.userService.userTotalPoints(dashboard.user_id);
                    /*   const level = await this.userService.findUserLevel(dashboard.current_points);
                      if (level) {
                        dashboard.user_level = level.level_position;
                        dashboard.level_badge_image = level.user_level_image;
                      } else {
                        dashboard.user_level = 1;
                      } */
                    dashboard.user_level = (_b = (_a = user.userLevel) === null || _a === void 0 ? void 0 : _a.level_position) !== null && _b !== void 0 ? _b : 1;
                    dashboard.level_badge_image = (_c = user.userLevel) === null || _c === void 0 ? void 0 : _c.user_level_image;
                    dashboard.user_id = user.user_id;
                    const d = user.user_login_time;
                    dashboard.last_login = (0, moment_1.default)(d).utc().format("DD-MM-YYYY hh:mm:ss");
                    dashboard.user_name = user.user_name;
                    resolve((0, api_utils_1.generateApiResponse)({
                        data: dashboard,
                        status: true,
                        statusCode: 200,
                        message: 'OK'
                    }));
                }
                else {
                    reject(new rest_1.HttpErrors.Unauthorized("Invalid credentials"));
                }
            }).catch((error) => reject(error));
        });
    }
    async userFcmTokenChange(fcmTokenChangeRequest) {
        return new Promise((resolve, reject) => {
            this.userService.userFcmUpdate(+(this.user.id), fcmTokenChangeRequest).then(() => {
                resolve((0, api_utils_1.generateApiResponse)({
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async userLogout(fcmTokenChangeRequest) {
        return new Promise((resolve, reject) => {
            this.userService.userLogout(+(this.user.id), fcmTokenChangeRequest).then(() => {
                resolve((0, api_utils_1.generateApiResponse)({
                    status: true,
                    statusCode: 200,
                    message: 'OK'
                }));
            }).catch((error) => reject(error));
        });
    }
    async getTaxDetails() {
        return new Promise((resolve, reject) => {
            this.userService.getTaxDetails(+(this.user.id)).then((taxes) => {
                resolve((0, api_utils_1.generateApiResponse)({
                    data: taxes,
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
    (0, rest_1.patch)('/users/me', {
        description: 'Update user.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': users_dto_1.USER_BY_ID_RESPONSE,
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        description: 'Update user info.',
        required: true,
        content: {
            'multipart/form-data': {
                schema: {
                    type: 'object',
                    properties: {
                        image: { type: 'string', format: 'binary' },
                        user_name: { type: 'string' },
                        user_last_name: { type: 'string' },
                        user_phone: { type: 'string' },
                    },
                },
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "updateBasicUserInfo", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.del)('/users/me', {
        description: 'Delete user account.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': users_dto_1.COUNT_RESPONSE,
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "deleteUserAccount", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/users/me', {
        description: 'User profile data.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': users_dto_1.USER_BY_ID_RESPONSE,
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findById", null);
tslib_1.__decorate([
    (0, rest_1.post)('/users/login'),
    (0, rest_1.response)(200, users_dto_1.USER_LOGIN_RESPONSE),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(user_login_model_1.UserLogin),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [user_login_model_1.UserLogin]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "userLogin", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/users/change-password', {
        description: 'Change login password.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': users_dto_1.USER_LOGIN_RESPONSE,
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(change_password_request_model_1.ChangePasswordRequest),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [change_password_request_model_1.ChangePasswordRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "userLoginPasswordChange", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/users/invites/history', {
        description: 'Invite list pagination.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': users_dto_1.INVITES_LIST_RESPONSE,
        },
    }),
    tslib_1.__param(0, rest_1.param.query.number('limit', { optional: true, default: 10 })),
    tslib_1.__param(1, rest_1.param.query.number('offset', { optional: true, default: 0 })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [Object, Object]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "findUserInviteList", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/users/dashboard', {
        description: 'API for get users dashboard data.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': users_dto_1.USER_DASHBOARD_RESPONSE,
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "userDashBoard", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/users/fcm/token', {
        description: 'Change FCM token for user device.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': {},
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(fcm_token_change_request_model_1.FcmTokenChangeRequest),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [fcm_token_change_request_model_1.FcmTokenChangeRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "userFcmTokenChange", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.post)('/users/logout', {
        description: 'User logout.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': {},
        },
    }),
    tslib_1.__param(0, (0, rest_1.requestBody)({
        content: {
            'application/json': {
                schema: (0, rest_1.getModelSchemaRef)(fcm_token_change_request_model_1.FcmTokenChangeRequest, { title: 'LogoutRequest', exclude: ['fcmToken'] }),
            },
        },
    })),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", [fcm_token_change_request_model_1.FcmTokenChangeRequest]),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "userLogout", null);
tslib_1.__decorate([
    (0, authentication_1.authenticate)('apiKey'),
    (0, rest_1.get)('/taxes', {
        description: 'Get tax data.',
        security: security_spec_1.OPERATION_SECURITY_SPEC_API_KEY,
        responses: {
            '200': users_dto_1.TAX_RESPONSE,
        },
    }),
    tslib_1.__metadata("design:type", Function),
    tslib_1.__metadata("design:paramtypes", []),
    tslib_1.__metadata("design:returntype", Promise)
], UserController.prototype, "getTaxDetails", null);
UserController = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.service)(services_1.ProfileUserService)),
    tslib_1.__param(1, (0, core_1.inject)(authentication_1.AuthenticationBindings.CURRENT_USER, { optional: true })),
    tslib_1.__metadata("design:paramtypes", [services_1.ProfileUserService, Object])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map