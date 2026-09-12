"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicValues = exports.Logger = exports.SupportedFilesInfo = exports.UserTypeConstants = exports.HealthCheckComponent = exports.MarketFlags = exports.HealthCheckLevel = exports.ActiveStatusConstants = void 0;
var ActiveStatusConstants;
(function (ActiveStatusConstants) {
    ActiveStatusConstants.ACTIVE = 1;
    ActiveStatusConstants.INACTIVE = 2;
    ActiveStatusConstants.DELETED = 0;
})(ActiveStatusConstants = exports.ActiveStatusConstants || (exports.ActiveStatusConstants = {}));
var HealthCheckLevel;
(function (HealthCheckLevel) {
    HealthCheckLevel.IMPORTANT = 2;
    HealthCheckLevel.OPTIONAL = 1;
    HealthCheckLevel.IGNORE = 0;
})(HealthCheckLevel = exports.HealthCheckLevel || (exports.HealthCheckLevel = {}));
var MarketFlags;
(function (MarketFlags) {
    MarketFlags.FEE_PERCENTAGES = {
        BROKAGE_AMOUNT: 0.005,
        TRANSACTION_AMOUNT: 0.005,
    };
    MarketFlags.PRODUCT_TYPE = {
        HOLDING: 0,
        POSITION: 1,
    };
    MarketFlags.ORDER_TYPE = {
        BUY: 0,
        SELL: 1,
    };
    MarketFlags.EXECUTION_TYPE = {
        MARKET: 0,
        LIMIT: 1,
    };
    MarketFlags.MARKET_STATUS = {
        ONLINE: 0,
        OFFLINE: 1,
    };
    MarketFlags.DAY_MARKET_OPEN_STATUS = {
        OFF_DAY: 0,
        OPEN_DAY: 1,
    };
    MarketFlags.PORTFOLIO_STATUS = {
        CURRENT_HOLDING: 0,
        OLD_HOLDING: 1,
    };
    MarketFlags.ORDER_STATUS = {
        DONE: 0,
        REQUESTED: 1,
        CANCELLED: 2,
        EXPIRED: 3,
        REJECTED: 4,
    };
    MarketFlags.ORDER_VALIDITY = {
        DAY: 0,
        GTD: 1,
        GTC: 2,
    };
})(MarketFlags = exports.MarketFlags || (exports.MarketFlags = {}));
var HealthCheckComponent;
(function (HealthCheckComponent) {
    HealthCheckComponent.DATABASE = 'health.database';
    HealthCheckComponent.API = 'health.api';
})(HealthCheckComponent = exports.HealthCheckComponent || (exports.HealthCheckComponent = {}));
var UserTypeConstants;
(function (UserTypeConstants) {
    UserTypeConstants.ADMIN = 'admin';
    UserTypeConstants.USER = 'user';
})(UserTypeConstants = exports.UserTypeConstants || (exports.UserTypeConstants = {}));
var SupportedFilesInfo;
(function (SupportedFilesInfo) {
    SupportedFilesInfo.mimeTypes = {
        images: ['image/png', 'image/jpeg', 'image/jpg'],
        videos: ['video/mp4'],
        license: ['text/plain', 'application/octet-stream'],
    };
    SupportedFilesInfo.extensions = {
        license: ['.license'],
        images: ['.png', '.jpeg', '.jpg'],
        videos: ['.mp4'],
    };
})(SupportedFilesInfo = exports.SupportedFilesInfo || (exports.SupportedFilesInfo = {}));
var Logger;
(function (Logger) {
    Logger.MORGAN_CUSTOM_FORMAT = '------\nID@[:id]\n[:date]  :remote-addr\n":method' +
        ':url" :status :message \nPF_ID> :profile \nD_INFO> :device \nDuration> :total-time(ms) RT> :response-time(ms) \nContentType> :type \nUA> :user-agent \n======\n';
    Logger.MORGAN_CUSTOM_ERROR_FORMAT = '------\nID@[:id]\n[:date]  :remote-addr\n":method' +
        ':url" :status :message \nPF_ID> :profile \nD_INFO> :device \nError> :error \nDuration> :total-time(ms) RT> :response-time(ms) \nContentType> :type \nUA> :user-agent \n======\n';
})(Logger = exports.Logger || (exports.Logger = {}));
var DynamicValues;
(function (DynamicValues) {
    /* Default time every day at 12:00 AM */
    DynamicValues.TempDeletionTriggerCronTime = '0 0 * * *';
    DynamicValues.TempDeletionPeriodInDays = 10;
    DynamicValues.LoggerLevel = 0;
    DynamicValues.TEMP_DELETION_CRON_TRIGGER_NAME = "CLEAR_TEMP";
    DynamicValues.POINT_SYSTEM = {
        TYPES: {
            LOGIN: 'Login',
            STOCK: 'Stock',
            TRADE_VALUE: 'Trade Value',
            BUY_TRANSACTION: 'Buy Transaction',
            RECHARGE: 'Recharge',
            REFERRAL: 'Referral',
            WATCHLIST: 'Watchlist',
        },
        _LEVELS: {
            '1': {
                LOGIN: {
                    POINT_PER_UNIT: 1,
                    UNIT: 1,
                    MAX_POINTS: 10
                },
                RECHARGE: {
                    POINT_PER_UNIT: 1,
                    UNIT: 15,
                    MAX_POINTS: 100
                },
                STOCK: {
                    POINT_PER_UNIT: 2,
                    UNIT: 1,
                    MAX_POINTS: 20
                },
                REFERRAL: {
                    POINT_PER_UNIT: 1,
                    UNIT: 1,
                    MAX_POINTS: 5
                },
                'BUY TRANSACTION': {
                    POINT_PER_UNIT: 1,
                    UNIT: 1,
                    MAX_POINTS: 15
                },
                'TRADE VALUE': {
                    POINT_PER_UNIT: 1,
                    UNIT: 15000,
                    MAX_POINTS: 100
                },
            },
            '2': {
                LOGIN: {
                    POINT_PER_UNIT: 1,
                    UNIT: 1,
                    MAX_POINTS: 20
                },
                RECHARGE: {
                    POINT_PER_UNIT: 1,
                    UNIT: 25,
                    MAX_POINTS: 80
                },
                STOCK: {
                    POINT_PER_UNIT: 2,
                    UNIT: 1,
                    MAX_POINTS: 30
                },
                WATCHLIST: {
                    POINT_PER_UNIT: 1,
                    UNIT: 1,
                    MAX_POINTS: 10
                },
                REFERRAL: {
                    POINT_PER_UNIT: 1,
                    UNIT: 1,
                    MAX_POINTS: 10
                },
                'BUY TRANSACTION': {
                    POINT_PER_UNIT: 1,
                    UNIT: 1,
                    MAX_POINTS: 15
                },
                'TRADE VALUE': {
                    POINT_PER_UNIT: 1,
                    UNIT: 25000,
                    MAX_POINTS: 80
                },
            },
        },
        LEVELS: {}
    };
    async function loadPointsSystem(userLevels) {
        if (userLevels)
            for await (const userLevel of userLevels) {
                const levelObject = DynamicValues.POINT_SYSTEM.LEVELS;
                levelObject[userLevel.level_position] = {
                    LOGIN: {
                        POINT_PER_UNIT: userLevel.login_point,
                        UNIT: 1,
                        MAX_POINTS: userLevel.max_login_point
                    },
                    RECHARGE: {
                        POINT_PER_UNIT: userLevel.recharge_pts,
                        UNIT: userLevel.recharge_unit,
                        MAX_POINTS: userLevel.max_recharge_pts
                    },
                    STOCK: {
                        POINT_PER_UNIT: userLevel.pts_per_stock,
                        UNIT: 1,
                        MAX_POINTS: userLevel.max_pts_per_stock
                    },
                    REFERRAL: {
                        POINT_PER_UNIT: userLevel.pts_per_referal,
                        UNIT: 1,
                        MAX_POINTS: userLevel.max_pts_per_referal
                    },
                    'BUY TRANSACTION': {
                        POINT_PER_UNIT: userLevel.pts_per_buy,
                        UNIT: 1,
                        MAX_POINTS: userLevel.max_pts_per_buy
                    },
                    'TRADE VALUE': {
                        POINT_PER_UNIT: userLevel.pts_per_unit_buy_trade_value,
                        UNIT: userLevel.unit_buy_trade_value,
                        MAX_POINTS: userLevel.max_pts_buy_trade_value
                    },
                    WATCHLIST: {
                        POINT_PER_UNIT: userLevel.pts_per_watchlist,
                        UNIT: 1,
                        MAX_POINTS: userLevel.max_pts_per_watchlist
                    },
                };
            }
    }
    DynamicValues.loadPointsSystem = loadPointsSystem;
})(DynamicValues = exports.DynamicValues || (exports.DynamicValues = {}));
//# sourceMappingURL=constants.js.map