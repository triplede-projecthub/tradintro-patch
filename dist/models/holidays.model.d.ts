import { Entity } from '@loopback/repository';
export declare class Holidays extends Entity {
    holiday_id?: number;
    holiday_day?: string;
    holiday_date: Date;
    holiday_event?: string;
    constructor(data?: Partial<Holidays>);
}
export interface HolidaysRelations {
}
export declare type HolidaysWithRelations = Holidays & HolidaysRelations;
