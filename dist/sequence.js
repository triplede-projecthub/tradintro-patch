"use strict";
//=============================================================================
//Licensed Materials - Property of George Joseph <george@aicenter.ae>
//(C) Copyright George Joseph <george@aicenter.ae> 2021
//Restricted Rights - Use, duplication or disclosure
//restricted by GSA ADP Schedule Contract with George Joseph <george@aicenter.ae>.
//=============================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sequence = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const core_1 = require("@loopback/core");
const rest_1 = require("@loopback/rest");
const compression_1 = tslib_1.__importDefault(require("compression"));
const helmet_1 = tslib_1.__importDefault(require("helmet")); // For security
const morgan_1 = tslib_1.__importDefault(require("morgan"));
const path_1 = tslib_1.__importDefault(require("path"));
const constants_1 = require("./utils/constants");
const request_log_model_1 = require("./models/dto/request-log.model");
const rateLimit = require('express-rate-limit');
const rfs = require('rotating-file-stream');
const pad = (num) => (num > 9 ? '' : '0') + num;
const errorFileGenerator = (time, index) => {
    if (!time)
        return 'error.log';
    return `${getFormattedNameFromDate(time, index)}-error.log`;
};
const commonFileGenerator = (time, index) => {
    if (!time)
        return 'common.log';
    return `${getFormattedNameFromDate(time, index)}-common.log`;
};
const getFormattedNameFromDate = (time, index) => {
    const month = time.getFullYear() + '' + pad(time.getMonth() + 1);
    const day = pad(time.getDate());
    const hour = pad(time.getHours());
    const minute = pad(time.getMinutes());
    return `${month}/${month}${day}-${hour}${minute}-${index}`;
};
const errorLogStream = rfs.createStream(errorFileGenerator, {
    size: '10M',
    interval: '2d',
    compress: 'gzip',
    path: path_1.default.join(__dirname, '../logs'),
});
const commonLogStream = rfs.createStream(commonFileGenerator, {
    size: '10M',
    interval: '2d',
    compress: 'gzip',
    path: path_1.default.join(__dirname, '../logs'),
});
morgan_1.default.token('id', function (req, res) {
    var _a;
    return ((_a = req.headers['req-id']) !== null && _a !== void 0 ? _a : '0');
});
morgan_1.default.token('device', function (req, res) {
    var _a;
    return ((_a = req.headers['device-x-info']) !== null && _a !== void 0 ? _a : 'unknown');
});
morgan_1.default.token('type', function (req, res) {
    return req.headers['content-type'];
});
morgan_1.default.token('message', function (req, res) {
    if (res) {
        return res.statusMessage;
    }
    else
        return '';
});
morgan_1.default.token('error', function (req, res) {
    if (res['statusCode'] != 200 && res['__custombody__']) {
        const error = res['__custombody__'];
        delete res['__custombody__'];
        return error || null;
    }
    return null;
});
morgan_1.default.token('profile', function (req, res) {
    if (req['__profile__']) {
        const profile = req['__profile__'];
        return profile.clientId || 'admin';
    }
    return null;
});
morgan_1.default.token('url', function (req, res) {
    var _a;
    return decodeURIComponent(decodeURI((_a = req.url) !== null && _a !== void 0 ? _a : ''));
});
const httpErrorMorgan = (0, morgan_1.default)(constants_1.Logger.MORGAN_CUSTOM_ERROR_FORMAT, {
    stream: errorLogStream,
    skip: (req, res) => {
        return res.statusCode < 400;
    },
});
const apiLimiter = rateLimit({
    windowMs: 1 * 60 * 500,
    max: function (req, res) {
        return assignMxByRoute(req);
    },
});
const ocrRequestFilter = (req, res, next) => {
    if (process.env.ENABLE_OCR_ONLY == 'true') {
        if (req.path.includes('liveness')) {
            //disable liveness request
            res.sendStatus(404);
        }
        else {
            next();
        }
    }
    else {
        next();
    }
};
let Sequence = class Sequence {
    constructor(findRoute, parseParams, invoke, send, reject, authenticateRequest) {
        this.findRoute = findRoute;
        this.parseParams = parseParams;
        this.invoke = invoke;
        this.send = send;
        this.reject = reject;
        this.authenticateRequest = authenticateRequest;
        this.commonLogMorgan = (0, morgan_1.default)(constants_1.Logger.MORGAN_CUSTOM_ERROR_FORMAT, {
            stream: commonLogStream,
            skip: (req, res) => {
                this.handleLivenessRequest(req, res);
                return false;
            },
        });
        this.middlewareList = [
            ocrRequestFilter,
            (0, helmet_1.default)({
                contentSecurityPolicy: {
                    directives: {
                        defaultSrc: [`'self'`],
                        connectSrc: [
                            `'self'`,
                            'https://tradintro.com',
                            'https://api.tradintro.com'
                        ],
                        styleSrc: [
                            'tradintro.com',
                            'api.tradintro.com',
                            'stackpath.bootstrapcdn.com',
                            `'self'`,
                            `'unsafe-inline'`,
                        ],
                        imgSrc: [
                            `'self'`,
                            'data:',
                            'loopback.io',
                            'tradintro.com',
                            'api.tradintro.com',
                            'aicenter.ae',
                            'validator.swagger.io',
                        ],
                        scriptSrc: [
                            'tradintro.com',
                            'api.tradintro.com',
                            'stackpath.bootstrapcdn.com',
                            `'self'`,
                            `https: 'unsafe-inline'`,
                        ],
                        //upgradeInsecureRequests:''
                    },
                },
            }),
            apiLimiter,
            this.commonLogMorgan,
            httpErrorMorgan,
            (0, compression_1.default)(),
        ];
        /**
         * Optional invoker for registered middleware in a chain.
         * To be injected via SequenceActions.INVOKE_MIDDLEWARE.
         */
        this.invokeMiddleware = () => false;
    }
    handleLivenessRequest(req, res) {
        const log = new request_log_model_1.RequestLog();
        if (req.extras) {
            log.requestId = req.headers['req-id'];
            log.headerInfo = req.headers['device-x-info'];
            log.hash = req.extras.hash;
            log.code = req.extras.code;
            log.profileId = req.extras.profileId;
            log.httpStatus = res.statusCode;
            console.log(res.statusMessage);
            log.timestamp = new Date().toUTCString();
            console.log('LOG', log);
        }
    }
    async handle(context) {
        try {
            const { request, response } = context;
            const finished = await this.invokeMiddleware(context);
            if (finished)
                return;
            const finishedChain = await this.invokeMiddleware(context, this.middlewareList);
            if (finishedChain)
                return;
            const route = this.findRoute(request);
            // call authentication action
            await this.authenticateRequest(request);
            const args = await this.parseParams(request, route);
            const result = await this.invoke(route, args);
            this.send(response, result);
        }
        catch (err) {
            this.reject(context, err);
        }
    }
};
tslib_1.__decorate([
    (0, core_1.inject)(rest_1.SequenceActions.INVOKE_MIDDLEWARE, { optional: true }),
    tslib_1.__metadata("design:type", Function)
], Sequence.prototype, "invokeMiddleware", void 0);
Sequence = tslib_1.__decorate([
    tslib_1.__param(0, (0, core_1.inject)(rest_1.SequenceActions.FIND_ROUTE)),
    tslib_1.__param(1, (0, core_1.inject)(rest_1.SequenceActions.PARSE_PARAMS)),
    tslib_1.__param(2, (0, core_1.inject)(rest_1.SequenceActions.INVOKE_METHOD)),
    tslib_1.__param(3, (0, core_1.inject)(rest_1.SequenceActions.SEND)),
    tslib_1.__param(4, (0, core_1.inject)(rest_1.SequenceActions.REJECT)),
    tslib_1.__param(5, (0, core_1.inject)(authentication_1.AuthenticationBindings.AUTH_ACTION)),
    tslib_1.__metadata("design:paramtypes", [Function, Function, Function, Function, Function, Function])
], Sequence);
exports.Sequence = Sequence;
function assignMxByRoute(req) {
    if (req.path && req.path.match('sdk')) {
        return 500;
    }
    return 50;
}
//# sourceMappingURL=sequence.js.map