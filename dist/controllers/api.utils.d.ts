import { ApiResponse } from '../models/dto/api-response-base.model';
export declare const generateApiResponse: <T>(response: Partial<{
    message?: string | undefined;
    data?: T | undefined;
    status?: boolean | undefined;
    statusCode?: number | undefined;
    errors?: string[] | undefined;
}>) => ApiResponse<T>;
export declare const getClassName: (stackTrace: string) => {
    className: string;
    functionName: string;
};
export declare const convertToDate: (date: string) => Date;
