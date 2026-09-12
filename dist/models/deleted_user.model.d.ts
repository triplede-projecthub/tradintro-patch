import { Entity } from '@loopback/repository';
export declare class DeletedUsers extends Entity {
    id?: number;
    delete_user_id: number;
    delete_user_name: string;
    delete_user_email: string;
    constructor(data?: Partial<DeletedUsers>);
}
export interface DeletedUsersRelations {
}
export declare type DeletedUsersWithRelations = DeletedUsers & DeletedUsersRelations;
