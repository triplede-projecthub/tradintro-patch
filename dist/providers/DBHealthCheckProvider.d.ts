import { Provider } from '@loopback/context';
import { ReadyCheck } from '@loopback/health';
import { TradIntroMySqlDataSource } from '../datasources';
export default class DBHealthCheckProvider implements Provider<ReadyCheck> {
    private ds;
    constructor(ds: TradIntroMySqlDataSource);
    value(): () => Promise<void>;
}
