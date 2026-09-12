import { Model } from '@loopback/repository';
export declare class RequestLog extends Model {
    timestamp?: string;
    httpStatus?: string;
    headers?: string;
    requestId?: string;
    httpStatusMsg?: string;
    profileId?: string;
    [prop: string]: any;
    constructor(data?: Partial<RequestLog>);
}
export interface RequestLogRelations {
}
export declare type RequestLogWithRelations = RequestLog & RequestLogRelations;
