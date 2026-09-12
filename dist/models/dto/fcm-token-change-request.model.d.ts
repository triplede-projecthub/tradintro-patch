import { Model } from '@loopback/repository';
export declare class FcmTokenChangeRequest extends Model {
    fcmToken?: string;
    deviceId: string;
    device: string;
    constructor(data?: Partial<FcmTokenChangeRequest>);
}
export interface FcmTokenChangeRequestRelations {
}
export declare type FcmTokenChangeRequestWithRelations = FcmTokenChangeRequest & FcmTokenChangeRequestRelations;
