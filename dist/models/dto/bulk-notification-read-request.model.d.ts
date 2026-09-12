import { Model } from '@loopback/repository';
export declare class BulkNotificationReadRequest extends Model {
    notificationIds: number[];
    [prop: string]: any;
    constructor(data?: Partial<BulkNotificationReadRequest>);
}
export interface BulkNotificationReadRequestRelations {
}
export declare type BulkNotificationReadRequestWithRelations = BulkNotificationReadRequest & BulkNotificationReadRequestRelations;
