"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setResponseBody = exports.ExpressServer = void 0;
const tslib_1 = require("tslib");
const context_1 = require("@loopback/context");
const events_1 = require("events");
const express_1 = tslib_1.__importDefault(require("express"));
const path_1 = tslib_1.__importDefault(require("path"));
const application_1 = require("./application");
const bodyParser = require('body-parser');
class ExpressServer {
    constructor(options = {}) {
        this.app = (0, express_1.default)();
        //this.app.set('trust proxy', true)
        this.lbApp = new application_1.TradIntroBackendApplication(options);
        this.app.use(exports.setResponseBody);
        this.app.use((req, res, next) => {
            req.headers['req-id'] = (0, context_1.generateUniqueId)();
            next();
        });
        this.app.set('trust proxy', (ip) => {
            if (ip === '127.0.0.1' || ip === '0.0.0.0')
                return true; // trusted IPs
            else
                return false;
        });
        this.app.use('/api', this.lbApp.requestHandler);
        this.app.use(bodyParser.raw({ type: 'image/*', limit: '10mb' }));
        this.app.get('/', (_req, res) => {
            res.sendFile(path_1.default.join(__dirname, '../public/index.html'));
        });
    }
    async boot() {
        await this.lbApp.boot();
    }
    async migrateSchema() {
        await this.lbApp.migrateSchema();
    }
    async start() {
        var _a, _b;
        await this.lbApp.start();
        const port = (_a = this.lbApp.restServer.config.port) !== null && _a !== void 0 ? _a : 3000;
        const host = (_b = this.lbApp.restServer.config.host) !== null && _b !== void 0 ? _b : '127.0.0.1';
        this.server = this.app.listen(port, host);
        await (0, events_1.once)(this.server, 'listening');
    }
    // For testing purposes
    async stop() {
        if (!this.server)
            return;
        await this.lbApp.stop();
        this.server.close();
        await (0, events_1.once)(this.server, 'close');
        this.server = undefined;
    }
}
exports.ExpressServer = ExpressServer;
const setResponseBody = (req, res, next) => {
    const oldWrite = res.write, oldEnd = res.end, chunks = [];
    res.write = function (chunk) {
        chunks.push(Buffer.from(chunk));
        oldWrite.apply(res, arguments);
    };
    res.end = function (chunk) {
        if (chunk) {
            chunks.push(Buffer.from(chunk));
        }
        const body = Buffer.concat(chunks).toString('utf8');
        res.__custombody__ = body;
        oldEnd.apply(res, arguments);
    };
    next();
};
exports.setResponseBody = setResponseBody;
//# sourceMappingURL=express.server.js.map