import { Count, Filter, FilterExcludingWhere, Where } from '@loopback/repository';
import { Indices } from '../models';
import { IndicesRepository } from '../repositories';
export declare class IndicesService {
    private indicesRepository;
    constructor(indicesRepository: IndicesRepository);
    count(where?: Where<Indices>): Promise<Count>;
    find(filter?: Filter<Indices>): Promise<Indices[]>;
    findById(id: number, filter?: FilterExcludingWhere<Indices>): Promise<Indices>;
}
