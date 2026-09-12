import { Indices } from '../models';
import { ApiResponse } from '../models/dto/api-response-base.model';
import { IndicesService, PortfolioService } from '../services';
export declare class IndicesController {
    indicesService: IndicesService;
    private portfolioService;
    constructor(indicesService: IndicesService, portfolioService: PortfolioService);
    find(indicesId?: number): Promise<ApiResponse<Indices[]>>;
}
