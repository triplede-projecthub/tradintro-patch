import { Count, Where } from '@loopback/repository';
import { Notifications, NotificationsRelations } from '../models';
import { MarketRepository, NotificationsRepository, PortfolioItemRepository, UserRepository, WatchListRepository } from '../repositories';
import { UtilService } from './util.service';
export declare class NotificationService {
    private notificationsRepository;
    private marketListRepository;
    private userRepository;
    private utilService;
    private portfolioRepository;
    private watchListRepository;
    constructor(notificationsRepository: NotificationsRepository, marketListRepository: MarketRepository, userRepository: UserRepository, utilService: UtilService, portfolioRepository: PortfolioItemRepository, watchListRepository: WatchListRepository);
    findFollowedStockIds(userId: number): Promise<number[]>;
    updateReadStatusOfNotification(id: string, userId: number): Promise<Count>;
    deleteNotificationForUser(id: number, userId: number): Promise<Count>;
    findById(id: number, userId: number): Promise<Notifications & NotificationsRelations | null>;
    count(where?: Where<Notifications>): Promise<Count>;
    find(userId: number, type?: string, read_status?: number, search?: string, limit?: number, offset?: number): Promise<Notifications[]>;
    generateNotificationQuery(notification_type: number[], notification_status: number[], alert_popup_status: number[], notification_user_id: number, offset?: number, limit?: number, userLevel?: number, searchQuery?: string, stockId?: number, followedStockFilter?: string): string;
    updateReadStatus(userId: number, notificationIds: number[]): Promise<Count>;
    setAlertForNotification(notificationId: number, userId: number, amount: number): Promise<Notifications & NotificationsRelations>;
    _convertUTCDateToLocalDate(date: Date): Date;
}
