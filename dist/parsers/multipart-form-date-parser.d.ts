/// <reference types="express" />
import { BodyParser, Request, RequestBody } from '@loopback/rest';
import { FileUploadHandler } from '../utils/types';
export declare const FORM_DATA = "multipart/form-data; ";
export default class MultipartFormDataBodyParser implements BodyParser {
    private handler;
    name: string;
    constructor(handler: FileUploadHandler);
    supports(mediaType: string): boolean;
    parse(request: Request): Promise<RequestBody>;
    /**
     * Get files and fields for the request
     * @param request - Http request
     */
    private static getFilesAndFields;
}
