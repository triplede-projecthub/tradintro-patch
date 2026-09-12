import { LifeCycleObserver } from '@loopback/core';
import { juggler } from '@loopback/repository';
export declare class TradIntroMySqlDataSource extends juggler.DataSource implements LifeCycleObserver {
    static dataSourceName: string;
    static readonly defaultConfig: {
        name: string;
        connector: string;
    };
    constructor(dsConfig?: object);
}
