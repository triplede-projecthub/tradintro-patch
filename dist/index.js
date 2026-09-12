"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
exports.main = exports.originsWhitelist = void 0;
const tslib_1 = require("tslib");
const dotenv = tslib_1.__importStar(require("dotenv"));
const path_1 = tslib_1.__importDefault(require("path"));
const express_server_1 = require("./express.server");
exports.originsWhitelist = [
    "https://api.tradintro.com",
    "http://api.tradintro.com",
    "api.tradintro.com"
];
async function main(options = {}) {
    const app = new express_server_1.ExpressServer(options);
    await app.boot();
    //await app.migrateSchema();
    await app.start();
    console.log(`Server is running`, process.env.PORT);
    return app;
}
exports.main = main;
if (require.main === module) {
    console.log("CONFIG PATH", __dirname);
    const configPath = path_1.default.resolve(__dirname, '../config/.env');
    console.log("CONFIG PATH RESOLVED", configPath);
    const result = dotenv.config({ path: configPath });
    console.log("CONFIG PATH RESOLVED", result);
    const originValidator = (origin, cb) => {
        let matched = false;
        if (origin) {
            for (const listedOrigin of exports.originsWhitelist) {
                const regArray = origin.match(listedOrigin);
                if (regArray) {
                    matched = true;
                    break;
                }
            }
            if (!matched) {
                console.log('CORS ERR >>', origin);
            }
        }
        else {
            cb(null, true);
        }
        cb(null, matched);
    };
    // Run the application
    const config = {
        rest: {
            port: +((_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8800),
            host: (_b = process.env.HOST) !== null && _b !== void 0 ? _b : `0.0.0.0`,
            cors: {
                origin: originValidator,
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                preflightContinue: false,
                optionsSuccessStatus: 204,
                maxAge: 86400,
                credentials: true,
                exposedHeaders: ['Content-Type', 'authorization', 'x-refresh-token', 'Content-Hash'],
            },
            gracePeriodForClose: 5000,
            openApiSpec: {
                // useful when used with OpenAPI-to-GraphQL to locate your application
                setServersFromRequest: false,
                servers: [
                    {
                        url: `${process.env.QUALIFIED_SERVER_URL}/api`,
                        description: 'Sandbox Server',
                    },
                    {
                        url: `http://localhost:${process.env.PORT}/api`,
                        description: 'Local Server',
                    },
                ],
                schemas: [{}],
                endpointMapping: {
                    '/openapi.json': { version: '1.1.11', format: 'json' },
                    '/openapi.yaml': { version: '1.1.11', format: 'yaml' },
                },
                disabled: false,
            },
            // Use the LB4 application as a route. It should not be listening.
            listenOnStart: false,
        },
        fileStorageDirectory: process.env.FILE_STORAGE_PATH
    };
    main(config).catch(err => {
        console.error('Cannot start the application.', err);
        process.exit(1);
    });
}
//# sourceMappingURL=index.js.map