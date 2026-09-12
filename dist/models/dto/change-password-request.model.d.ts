import { Model } from '@loopback/repository';
export declare class ChangePasswordRequest extends Model {
    currentPassword: string;
    newPassword: string;
    constructor(data?: Partial<ChangePasswordRequest>);
}
export interface ChangePasswordRequestRelations {
}
export declare type ChangePasswordRequestWithRelations = ChangePasswordRequest & ChangePasswordRequestRelations;
