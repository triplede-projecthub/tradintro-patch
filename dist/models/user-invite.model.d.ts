import { Entity } from '@loopback/repository';
export declare class UserInvite extends Entity {
    invite_id?: number;
    invite_from: string;
    invite_from_member?: number;
    invite_to: string;
    invite_email: string;
    invite_status?: number;
    invite_email_status?: number;
    invite_date?: Date;
    constructor(data?: Partial<UserInvite>);
}
export interface UserInviteRelations {
}
export declare type UserInviteWithRelations = UserInvite & UserInviteRelations;
