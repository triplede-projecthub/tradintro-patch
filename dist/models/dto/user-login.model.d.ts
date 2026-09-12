import { Model } from '@loopback/repository';
export declare class UserLogin extends Model {
    username: string;
    password: string;
    [prop: string]: any;
    constructor(data?: Partial<UserLogin>);
}
export interface UserLoginRelations {
}
export declare type UserLoginWithRelations = UserLogin & UserLoginRelations;
