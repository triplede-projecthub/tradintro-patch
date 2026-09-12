import { Client } from '@loopback/testlab';
import { TradIntroBackendApplication } from '../../application';
export declare function setupApplication(): Promise<AppWithClient>;
export interface AppWithClient {
    app: TradIntroBackendApplication;
    client: Client;
}
