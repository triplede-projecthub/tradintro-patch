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
    updateReadStatusOfNotification(id: string, userId: number): Promise<Count>;
    deleteNotificationForUser(id: number, userId: number): Promise<Count>;
    findById(id: number, userId: number): Promise<Notifications & NotificationsRelations | null>;
    count(where?: Where<Notifications>): Promise<Count>;
    getViewerLevel(userId: number): Promise<number>;
    buildNotificationWhere(userId: number, type?: string, read_status?: number, userLevel?: number): string;
    countForUser(userId: number, type?: string, read_status?: number): Promise<{
        count: number;
    }>;
    find(userId: number, type?: string, read_status?: number, search?: string, limit?: number, offset?: number): Promise<Notifications[]>;
    updateReadStatus(userId: number, notificationIds: number[]): Promise<Count>;
    setAlertForNotification(notificationId: number, userId: number, amount: number): Promise<Notifications & NotificationsRelations>;
    _convertUTCDateToLocalDate(date: Date): Date;
}
