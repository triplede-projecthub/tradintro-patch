import { Model } from '@loopback/repository';
export declare class LoginResponseData extends Model {
    token?: string;
    refresh_token?: string;
    pkiKey?: string;
    [prop: string]: any;
    constructor(data?: Partial<LoginResponseData>);
}
export interface LoginDataRelations {
}
export declare type LoginDataWithRelations = LoginResponseData & LoginDataRelations;
