/// <reference types="express" />
import { BodyParser, Request, RequestBody } from '@loopback/rest';
export declare const IMAGE_DATA = "image/";
export default class ImageBodyParser implements BodyParser {
    name: string;
    constructor();
    supports(mediaType: string): boolean;
    parse(request: Request): Promise<RequestBody>;
    /**
     * Get files from the request
     * @param request - Http request
     */
    private static getFilesAndFields;
}
