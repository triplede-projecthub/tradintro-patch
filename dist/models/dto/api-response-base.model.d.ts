import { Model } from '@loopback/repository';
export declare class ApiResponse<T> extends Model {
    status?: boolean;
    statusCode?: number;
    data?: T;
    message?: string;
    [prop: string]: any;
    constructor(data?: Partial<ApiResponse<T>>);
}
