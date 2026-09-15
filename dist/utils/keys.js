"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.STORAGE_DIRECTORY = exports.FILE_UPLOAD_SERVICE = exports.UserServiceBindings = exports.TokenServiceBindings = exports.TokenServiceConstants = exports.PasswordHasherBindings = exports.DynamicKeys = void 0;
const context_1 = require("@loopback/context");
var DynamicKeys;
(function (DynamicKeys) {
    DynamicKeys.CLEAR_TEMP_SERVICE = context_1.BindingKey.create('service.clear.temp');
    DynamicKeys.MARKET_OPEN_SETTLEMENT_SERVICE = context_1.BindingKey.create('service.market.open.settlement');
    DynamicKeys.CONFIGURATION_DATA_OBJECT = context_1.BindingKey.create('configuration.data.object');
})(DynamicKeys = exports.DynamicKeys || (exports.DynamicKeys = {}));
var PasswordHasherBindings;
(function (PasswordHasherBindings) {
    PasswordHasherBindings.PASSWORD_HASHER = context_1.BindingKey.create('services.hasher');
    PasswordHasherBindings.ROUNDS = context_1.BindingKey.create('services.hasher.rounds');
})(PasswordHasherBindings = exports.PasswordHasherBindings || (exports.PasswordHasherBindings = {}));
var TokenServiceConstants;
(function (TokenServiceConstants) {
    TokenServiceConstants.REFRESH_TOKEN_SECRET_VALUE = 'qwhkbfdo097nh';
    TokenServiceConstants.API_KEY_SECRET_VALUE = 'qwhkghuo097nh';
    TokenServiceConstants.API_TOKEN_EXPIRES_IN_VALUE = '2h'; // TI24-0113-001: 2h session
    TokenServiceConstants.REFRESH_TOKEN_EXPIRES_IN_VALUE = '96h';
})(TokenServiceConstants = exports.TokenServiceConstants || (exports.TokenServiceConstants = {}));
var TokenServiceBindings;
(function (TokenServiceBindings) {
    TokenServiceBindings.API_KEY_SECRET = context_1.BindingKey.create('authentication.api.key.secret');
    TokenServiceBindings.API_TOKEN_EXPIRES_IN = context_1.BindingKey.create('authentication.jwt.expiresIn');
    TokenServiceBindings.REFRESH_TOKEN_SECRET = context_1.BindingKey.create('authentication.jwt.refresh.secret');
    TokenServiceBindings.REFRESH_TOKEN_EXPIRES_IN = context_1.BindingKey.create('authentication.jwt.refresh.expiresIn');
    TokenServiceBindings.TOKEN_SERVICE = context_1.BindingKey.create('services.jwt.service');
})(TokenServiceBindings = exports.TokenServiceBindings || (exports.TokenServiceBindings = {}));
var UserServiceBindings;
(function (UserServiceBindings) {
    UserServiceBindings.USER_SERVICE = context_1.BindingKey.create('services.user.service');
})(UserServiceBindings = exports.UserServiceBindings || (exports.UserServiceBindings = {}));
/**
 * Binding key for the file upload service
 */
exports.FILE_UPLOAD_SERVICE = context_1.BindingKey.create('services.FileUpload');
/**
 * Binding key for the storage directory
 */
exports.STORAGE_DIRECTORY = context_1.BindingKey.create('storage.directory');
//# sourceMappingURL=keys.js.map