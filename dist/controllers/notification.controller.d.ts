import { Count } from '@loopback/repository';
import { UserProfile } from '@loopback/security';
import { Notifications } from '../models';
import { ApiResponse } from '../models/dto/api-response-base.model';
import { BulkNotificationReadRequest } from '../models/dto/bulk-notification-read-request.model';
import { NotificationService } from '../services';
export declare class NotificationController {
    notificationService: NotificationService;
    private user;
    constructor(notificationService: NotificationService, user: UserProfile);
    count(read_status?: number, type?: string): Promise<ApiResponse<Count>>;
    find(type?: string, read_status?: number, search?: string, limit?: number, offset?: number): Promise<ApiResponse<Notifications[]>>;
    findById(id: number): Promise<ApiResponse<Notifications>>;
    deleteNotificationForUser(id: number): Promise<ApiResponse<Count>>;
    deleteAllNotificationForUser(): Promise<ApiResponse<Count>>;
    readNotificationStatusOfUser(id: string): Promise<ApiResponse<Count>>;
    bulkNotificationRead(body: BulkNotificationReadRequest): Promise<ApiResponse<Count>>;
    modifyAlertPrice(id: number, alertRequest: {
        amount: number;
    }): Promise<ApiResponse<Notifications>>;
}
