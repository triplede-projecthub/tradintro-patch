import { Model } from '@loopback/repository';
export declare class UserLevelsResponse extends Model {
    myLevel: number;
    myPoints: number;
    levels: object[];
    constructor(data?: Partial<UserLevelsResponse>);
}
export interface UserLevelsResponseRelations {
}
export declare type UserLevelsResponseWithRelations = UserLevelsResponse & UserLevelsResponseRelations;
