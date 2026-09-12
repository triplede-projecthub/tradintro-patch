import { ApplicationConfig } from './application';
import { ExpressServer } from './express.server';
export declare const originsWhitelist: string[];
export declare function main(options?: ApplicationConfig): Promise<ExpressServer>;
