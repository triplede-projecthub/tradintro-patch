import { Entity } from '@loopback/repository';
export declare class UserToken extends Entity {
    token_id?: number;
    token_user_id: number;
    token: string;
    device: string;
    device_id: string;
    token_status?: number;
    created_on?: Date;
    updated_on?: Date;
    constructor(data?: Partial<UserToken>);
}
export interface UserTokenRelations {
}
export declare type UserTokenWithRelations = UserToken & UserTokenRelations;
