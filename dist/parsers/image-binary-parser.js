"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IMAGE_DATA = void 0;
const tslib_1 = require("tslib");
const rest_1 = require("@loopback/rest");
const express_1 = tslib_1.__importDefault(require("express"));
const fs_1 = tslib_1.__importDefault(require("fs"));
const path_1 = tslib_1.__importDefault(require("path"));
const uuid4_1 = tslib_1.__importDefault(require("uuid4"));
exports.IMAGE_DATA = 'image/';
const imageParser = express_1.default.raw({ type: 'image/*', limit: '10mb' });
const mime = require('mime-types');
const fsPromise = fs_1.default.promises;
class ImageBodyParser {
    constructor() {
        this.name = exports.IMAGE_DATA;
    }
    supports(mediaType) {
        // The mediaType can be
        // `image/*;
        const isSupported = mediaType.startsWith(exports.IMAGE_DATA);
        return isSupported;
    }
    async parse(request) {
        return new Promise((resolve, reject) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            imageParser(request, {}, (err) => {
                if (err)
                    reject(err);
                else {
                    resolve({
                        value: ImageBodyParser.getFilesAndFields(request),
                    });
                }
            });
        });
    }
    /**
     * Get files from the request
     * @param request - Http request
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    static async getFilesAndFields(request) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const type = request.headers['content-type'];
        const ext = mime.extension(type);
        const fileName = `${Date.now() + '-' + (0, uuid4_1.default)()}.` + ext;
        const filePath = path_1.default.join(__dirname, '../../.sandbox', `/${fileName}`);
        try {
            await fsPromise.writeFile(filePath, request.body);
        }
        catch (err) {
            throw new rest_1.HttpErrors.BadRequest('E602 - Invalid body');
        }
        return {
            file: {
                fieldname: 'body',
                originalname: fileName,
                path: filePath,
                extension: ext,
                encoding: 'base64',
                mimetype: type,
                size: request.body.length,
            },
        };
    }
}
exports.default = ImageBodyParser;
//# sourceMappingURL=image-binary-parser.js.map