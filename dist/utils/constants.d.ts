import { UserLevelPoints } from '../models';
export declare namespace ActiveStatusConstants {
    const ACTIVE = 1;
    const INACTIVE = 2;
    const DELETED = 0;
}
export declare namespace HealthCheckLevel {
    const IMPORTANT = 2;
    const OPTIONAL = 1;
    const IGNORE = 0;
}
export declare namespace MarketFlags {
    const FEE_PERCENTAGES: {
        BROKAGE_AMOUNT: number;
        TRANSACTION_AMOUNT: number;
    };
    const PRODUCT_TYPE: {
        HOLDING: number;
        POSITION: number;
    };
    const ORDER_TYPE: {
        BUY: number;
        SELL: number;
    };
    const EXECUTION_TYPE: {
        MARKET: number;
        LIMIT: number;
    };
    const MARKET_STATUS: {
        ONLINE: number;
        OFFLINE: number;
    };
    const DAY_MARKET_OPEN_STATUS: {
        OFF_DAY: number;
        OPEN_DAY: number;
    };
    const PORTFOLIO_STATUS: {
        CURRENT_HOLDING: number;
        OLD_HOLDING: number;
    };
    const ORDER_STATUS: {
        DONE: number;
        REQUESTED: number;
        CANCELLED: number;
        EXPIRED: number;
        REJECTED: number;
    };
    const ORDER_VALIDITY: {
        DAY: number;
        GTD: number;
        GTC: number;
    };
}
export declare namespace HealthCheckComponent {
    const DATABASE = "health.database";
    const API = "health.api";
}
export declare namespace UserTypeConstants {
    const ADMIN = "admin";
    const USER = "user";
}
export declare namespace SupportedFilesInfo {
    const mimeTypes: {
        images: string[];
        videos: string[];
        license: string[];
    };
    const extensions: {
        license: string[];
        images: string[];
        videos: string[];
    };
}
export declare namespace Logger {
    const MORGAN_CUSTOM_FORMAT: string;
    const MORGAN_CUSTOM_ERROR_FORMAT: string;
}
export declare namespace DynamicValues {
    let TempDeletionTriggerCronTime: string;
    let TempDeletionPeriodInDays: number;
    let LoggerLevel: number;
    const TEMP_DELETION_CRON_TRIGGER_NAME: string;
    const POINT_SYSTEM: {
        TYPES: {
            LOGIN: string;
            STOCK: string;
            TRADE_VALUE: string;
            BUY_TRANSACTION: string;
            RECHARGE: string;
            REFERRAL: string;
            WATCHLIST: string;
        };
        _LEVELS: {
            '1': {
                LOGIN: {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                RECHARGE: {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                STOCK: {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                REFERRAL: {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                'BUY TRANSACTION': {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                'TRADE VALUE': {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
            };
            '2': {
                LOGIN: {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                RECHARGE: {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                STOCK: {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                WATCHLIST: {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                REFERRAL: {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                'BUY TRANSACTION': {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
                'TRADE VALUE': {
                    POINT_PER_UNIT: number;
                    UNIT: number;
                    MAX_POINTS: number;
                };
            };
        };
        LEVELS: {};
    };
    function loadPointsSystem(userLevels: UserLevelPoints[]): Promise<void>;
}
