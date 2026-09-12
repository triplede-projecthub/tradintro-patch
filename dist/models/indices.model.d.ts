import { Entity } from '@loopback/repository';
export declare class Indices extends Entity {
    indices_id?: number;
    indices_name: string;
    indices_code: string;
    indices_open?: number;
    indices_close?: number;
    indices_high?: number;
    indices_low?: number;
    currentPrice: number;
    currentPriceDiff: number;
    currentPriceDiffPer: number;
    getCurrentPrice(): number;
    getCurrentPriceDiff(): number;
    getCurrentPriceDiffPer(): number;
    prepareForResponse(): void;
    constructor(data?: Partial<Indices>);
    private limitDecimalPoints;
    private roundNumberV1;
}
export interface IndicesRelations {
}
export declare type IndicesWithRelations = Indices & IndicesRelations;
