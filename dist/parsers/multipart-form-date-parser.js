"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FORM_DATA = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const path_1 = tslib_1.__importDefault(require("path"));
const keys_1 = require("../utils/keys");
exports.FORM_DATA = 'multipart/form-data; ';
let MultipartFormDataBodyParser = class MultipartFormDataBodyParser {
    constructor(handler) {
        this.handler = handler;
        this.name = exports.FORM_DATA;
    }
    supports(mediaType) {
        // The mediaType can be
        // `multipart/form-data; boundary=--------------------------979177593423179356726653`
        const isSupported = mediaType.startsWith(exports.FORM_DATA);
        return isSupported;
    }
    async parse(request) {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            this.handler(request, {}, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve({
                        value: MultipartFormDataBodyParser.getFilesAndFields(request),
                    });
                }
            });
        });
    }
    /**
     * Get files and fields for the request
     * @param request - Http request
     */
    static getFilesAndFields(request) {
        const uploadedFiles = request.files;
        const mapper = (f) => ({
            fieldname: f.fieldname,
            filename: f.filename,
            originalname: f.originalname,
            path: f.path,
            extension: path_1.default.extname(f.path),
            encoding: f.encoding,
            mimetype: f.mimetype,
            size: f.size,
        });
        let files = [];
        if (Array.isArray(uploadedFiles)) {
            files = uploadedFiles.map(mapper);
        }
        else {
            for (const filename in uploadedFiles) {
                files.push(...uploadedFiles[filename].map(mapper));
            }
        }
        return { files, body: request.body };
    }
};
MultipartFormDataBodyParser = tslib_1.__decorate([
    tslib_1.__param(0, (0, context_1.inject)(keys_1.FILE_UPLOAD_SERVICE)),
    tslib_1.__metadata("design:paramtypes", [Function])
], MultipartFormDataBodyParser);
exports.default = MultipartFormDataBodyParser;
//# sourceMappingURL=multipart-form-date-parser.js.map