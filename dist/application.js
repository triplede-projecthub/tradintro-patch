"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TradIntroBackendApplication = void 0;
const tslib_1 = require("tslib");
const authentication_1 = require("@loopback/authentication");
const boot_1 = require("@loopback/boot");
const core_1 = require("@loopback/core");
const health_1 = require("@loopback/health");
const repository_1 = require("@loopback/repository");
const rest_1 = require("@loopback/rest");
const rest_explorer_1 = require("@loopback/rest-explorer");
const service_proxy_1 = require("@loopback/service-proxy");
const fs_1 = tslib_1.__importDefault(require("fs"));
const multer_1 = tslib_1.__importDefault(require("multer"));
const path_1 = tslib_1.__importDefault(require("path"));
const _1 = require(".");
const api_key_strategy_1 = require("./authentication/api-key.strategy");
const refresh_key_strategy_1 = require("./authentication/refresh-key.strategy");
const image_binary_parser_1 = tslib_1.__importDefault(require("./parsers/image-binary-parser"));
const multipart_form_date_parser_1 = tslib_1.__importDefault(require("./parsers/multipart-form-date-parser"));
const DBHealthCheckProvider_1 = tslib_1.__importDefault(require("./providers/DBHealthCheckProvider"));
const sequence_1 = require("./sequence");
const services_1 = require("./services");
const constants_1 = require("./utils/constants");
const keys_1 = require("./utils/keys");
class TradIntroBackendApplication extends (0, boot_1.BootMixin)((0, service_proxy_1.ServiceMixin)((0, repository_1.RepositoryMixin)(rest_1.RestApplication))) {
    constructor(options = {}) {
        super(options);
        // setup binding
        this.setupBinding();
        // Add security spec
        this.addSecuritySpec();
        this.component(authentication_1.AuthenticationComponent);
        (0, authentication_1.registerAuthenticationStrategy)(this, api_key_strategy_1.ApiKeyStrategy);
        (0, authentication_1.registerAuthenticationStrategy)(this, refresh_key_strategy_1.RefreshKeyStrategy);
        // Set up the custom sequence
        this.sequence(sequence_1.Sequence);
        this.configureFileUpload(options.fileStorageDirectory);
        this.configure(health_1.HealthBindings.COMPONENT).to({
            openApiSpec: true,
        });
        this.component(health_1.HealthComponent);
        this.bind('health.database')
            .toProvider(DBHealthCheckProvider_1.default)
            .tag(health_1.HealthTags.READY_CHECK);
        // Set up default home page
        this.static('/', path_1.default.join(__dirname, '../public'));
        // Customize @loopback/rest-explorer configuration here
        this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
            path: '/explorer',
        });
        this.component(rest_explorer_1.RestExplorerComponent);
        this.projectRoot = __dirname;
        // Customize @loopback/boot Booter Conventions here
        this.bootOptions = {
            controllers: {
                // Customize ControllerBooter Conventions here
                dirs: ['controllers'],
                extensions: ['.controller.js'],
                nested: true,
            },
        };
    }
    /**
     * Configure `multer` options for file (avatar) upload
     */
    configureFileUpload(destination) {
        // Upload files to `dist/.sandbox/avatar` by default
        destination = ((destination !== null && destination !== void 0 ? destination : path_1.default.join(__dirname, '../.sandbox')) + "/avatar");
        this.bind(keys_1.STORAGE_DIRECTORY).to(destination);
        const multerOptions = {
            limits: {
                fileSize: 5485760, // 5 Mb
            },
            fileFilter: (req, file, cb) => {
                const ext = path_1.default.extname(file.originalname);
                if ((constants_1.SupportedFilesInfo.mimeTypes.images.includes(file.mimetype) ||
                    constants_1.SupportedFilesInfo.mimeTypes.videos.includes(file.mimetype)) &&
                    (constants_1.SupportedFilesInfo.extensions.images.includes(ext) ||
                        constants_1.SupportedFilesInfo.extensions.videos.includes(ext))) {
                    cb(null, true);
                }
                else {
                    cb(null, true);
                    console.log('M File Error', file);
                    // cb(new HttpErrors.NotAcceptable('E201 - Invalid file type.'));
                }
            },
            storage: multer_1.default.diskStorage({
                destination,
                // Use the original file name as is
                filename: (req, file, cb) => {
                    const fileName = (0, core_1.generateUniqueId)() + path_1.default.extname(file.originalname);
                    cb(null, fileName);
                },
            }),
        };
        // Configure the file upload service with multer options
        this.configure(keys_1.FILE_UPLOAD_SERVICE).to(multerOptions);
    }
    setupBinding() {
        this.bind(keys_1.DynamicKeys.CLEAR_TEMP_SERVICE).toClass(services_1.ClearTempService);
        this.bind(keys_1.DynamicKeys.MARKET_OPEN_SETTLEMENT_SERVICE).toClass(services_1.MarketOpenSettlementService);
        this.bodyParser(multipart_form_date_parser_1.default);
        this.bodyParser(image_binary_parser_1.default);
        this.bind(rest_1.RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({ limit: '20mb' });
        this.bind(rest_1.RestBindings.ERROR_WRITER_OPTIONS).to({ debug: false });
        this.bind(keys_1.PasswordHasherBindings.PASSWORD_HASHER).toClass(services_1.BCryptPasswordHasherService);
        this.bind(keys_1.PasswordHasherBindings.ROUNDS).to(10);
        //this.bind(UserServiceBindings.USER_SERVICE).toClass(ProfileUserService);
        this.bind(keys_1.TokenServiceBindings.TOKEN_SERVICE).toClass(services_1.JWTServiceUtils);
        this.bind(keys_1.TokenServiceBindings.REFRESH_TOKEN_SECRET).to(keys_1.TokenServiceConstants.REFRESH_TOKEN_SECRET_VALUE);
        this.bind(keys_1.TokenServiceBindings.API_KEY_SECRET).to(keys_1.TokenServiceConstants.API_KEY_SECRET_VALUE);
        this.bind(keys_1.TokenServiceBindings.API_TOKEN_EXPIRES_IN).to(keys_1.TokenServiceConstants.API_TOKEN_EXPIRES_IN_VALUE);
        this.bind(keys_1.TokenServiceBindings.REFRESH_TOKEN_EXPIRES_IN).to(keys_1.TokenServiceConstants.REFRESH_TOKEN_EXPIRES_IN_VALUE);
        this.loadConfiguration();
    }
    addSecuritySpec() {
        this.api({
            openapi: '3.0.0',
            info: {
                title: 'TradIntro API Documentation',
                version: '1.1.11',
                contact: {
                    name: 'George Joseph',
                    email: 'info@georgepj.me',
                },
            },
            paths: {},
            components: {
                securitySchemes: {
                    apiKey: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                    refreshKey: {
                        type: 'http',
                        scheme: 'bearer',
                        bearerFormat: 'JWT',
                    },
                },
            },
            //servers: [{url: `https:${process.env.HOST ?? 'localhost'}:${+(process.env.PORT ?? 3500)}/api`}],
            servers: [{ url: `${process.env.QUALIFIED_SERVER_URL}/api` },
                { url: `http://localhost:${process.env.PORT}/api` }],
        });
    }
    loadConfiguration() {
        var _a;
        fs_1.default.readFile(path_1.default.join(__dirname, (_a = process.env.CONFIG_FILE_PATH) !== null && _a !== void 0 ? _a : '../config/config.json'), async (error, data) => {
            var _a, _b;
            if (error) {
                //ignore config load
                console.log('CONFIG FILE ERR:', error);
                this.bind(keys_1.DynamicKeys.CONFIGURATION_DATA_OBJECT).to(JSON.parse('{}'));
            }
            else {
                const config = JSON.parse(data.toString());
                console.log('CONFIG LOADED:', config);
                if (config.WhiteListedDomains) {
                    for (const domain of config.WhiteListedDomains) {
                        _1.originsWhitelist.push(domain);
                    }
                }
                this.bind(keys_1.DynamicKeys.CONFIGURATION_DATA_OBJECT).to(config);
                constants_1.DynamicValues.LoggerLevel = +config.LoggerLevel;
                constants_1.DynamicValues.TempDeletionPeriodInDays = +((_a = config.TempDeletionPeriodInDays) !== null && _a !== void 0 ? _a : '10');
                constants_1.DynamicValues.TempDeletionTriggerCronTime =
                    config.TempDeletionTriggerCronTime;
                if (((_b = process.env.DISABLE_API_EXPLORER) !== null && _b !== void 0 ? _b : 'true') == 'false') {
                    console.log('EXPLORER SETUP');
                    // Set up default home page
                    this.static('/', path_1.default.join(__dirname, '../public'));
                    // Customize @loopback/rest-explorer configuration here
                    this.configure(rest_explorer_1.RestExplorerBindings.COMPONENT).to({
                        path: '/explorer',
                    });
                    this.component(rest_explorer_1.RestExplorerComponent);
                }
            }
            setTimeout(async () => {
                const clearTempService = await this.get(keys_1.DynamicKeys.CLEAR_TEMP_SERVICE);
                clearTempService.scheduleCroneJob();
                const marketOpenSettlementService = await this.get(keys_1.DynamicKeys.MARKET_OPEN_SETTLEMENT_SERVICE);
                marketOpenSettlementService.scheduleCroneJob();
            }, 30000);
        });
        if (process.env.NODE_ENV !== 'production') {
            /* const logMemory = () => {
              const util = require('util');
              console.log(util.inspect(process.memoryUsage()));
              setTimeout(logMemory, 60000);
            };
            logMemory(); */
        }
    }
}
exports.TradIntroBackendApplication = TradIntroBackendApplication;
//# sourceMappingURL=application.js.map