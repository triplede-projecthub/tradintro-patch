import { TokenService, UserService } from '@loopback/authentication';
import { BindingKey } from '@loopback/context';
import { UserLogin } from '../models/dto/user-login.model';
import { User } from '../models/user.model';
import { ClearTempService, MarketOpenSettlementService, PasswordHasher } from '../services';
import { FileUploadHandler } from './types';
export declare namespace DynamicKeys {
    const CLEAR_TEMP_SERVICE: BindingKey<ClearTempService>;
    const MARKET_OPEN_SETTLEMENT_SERVICE: BindingKey<MarketOpenSettlementService>;
    const CONFIGURATION_DATA_OBJECT: BindingKey<any>;
}
export declare namespace PasswordHasherBindings {
    const PASSWORD_HASHER: BindingKey<PasswordHasher<string>>;
    const ROUNDS: BindingKey<number>;
}
export declare namespace TokenServiceConstants {
    const REFRESH_TOKEN_SECRET_VALUE = "qwhkbfdo097nh";
    const API_KEY_SECRET_VALUE = "qwhkghuo097nh";
    const API_TOKEN_EXPIRES_IN_VALUE = "24h";
    const REFRESH_TOKEN_EXPIRES_IN_VALUE = "96h";
}
export declare namespace TokenServiceBindings {
    const API_KEY_SECRET: BindingKey<string>;
    const API_TOKEN_EXPIRES_IN: BindingKey<string>;
    const REFRESH_TOKEN_SECRET: BindingKey<string>;
    const REFRESH_TOKEN_EXPIRES_IN: BindingKey<string>;
    const TOKEN_SERVICE: BindingKey<TokenService>;
}
export declare namespace UserServiceBindings {
    const USER_SERVICE: BindingKey<UserService<User, UserLogin>>;
}
/**
 * Binding key for the file upload service
 */
export declare const FILE_UPLOAD_SERVICE: BindingKey<FileUploadHandler>;
/**
 * Binding key for the storage directory
 */
export declare const STORAGE_DIRECTORY: BindingKey<string>;
