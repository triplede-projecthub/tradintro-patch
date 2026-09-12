import express from 'express';
import { ApplicationConfig, TradIntroBackendApplication } from './application';
export { ApplicationConfig };
export declare class ExpressServer {
    readonly app: express.Application;
    readonly lbApp: TradIntroBackendApplication;
    private server?;
    constructor(options?: ApplicationConfig);
    boot(): Promise<void>;
    migrateSchema(): Promise<void>;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export declare const setResponseBody: (req: any, res: any, next: any) => void;
