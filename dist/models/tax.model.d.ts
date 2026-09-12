import { Entity } from '@loopback/repository';
export declare class Tax extends Entity {
    tax_id?: number;
    tax_name: string;
    tax_value: number;
    tax_status?: number;
    constructor(data?: Partial<Tax>);
}
export interface TaxRelations {
}
export declare type TaxWithRelations = Tax & TaxRelations;
