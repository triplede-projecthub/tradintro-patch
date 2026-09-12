import { Model } from '@loopback/repository';
export declare class ProfitLossSummery extends Model {
    realizedProfitLossValue?: number;
    realizedProfitLossValuePercentage?: number;
    unRealizedProfitLossValue?: number;
    unRealizedProfitLossValuePercentage?: number;
    totalInvestmentValue?: number;
    constructor(data?: Partial<ProfitLossSummery>);
}
export interface ProfitLossSummeryRelations {
}
export declare type ProfitLossSummeryWithRelations = ProfitLossSummery & ProfitLossSummeryRelations;
