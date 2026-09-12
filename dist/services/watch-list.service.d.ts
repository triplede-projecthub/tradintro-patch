import { Count, Where } from '@loopback/repository';
import { WatchList } from '../models';
import { MarketRepository, NotificationsRepository, UserRepository, WatchListRepository } from '../repositories';
import { UserPointsService } from './user-points.service';
import { UtilService } from './util.service';
export declare class WatchListService {
    private watchListRepository;
    private marketListRepository;
    private notificationsRepository;
    private utilService;
    private userPointsService;
    private userRepository;
    constructor(watchListRepository: WatchListRepository, marketListRepository: MarketRepository, notificationsRepository: NotificationsRepository, utilService: UtilService, userPointsService: UserPointsService, userRepository: UserRepository);
    create(watchList: Partial<WatchList>, userId: number): Promise<WatchList>;
    handleWatchListPoint(userId: number): Promise<void>;
    _convertUTCDateToLocalDate(date: Date): Date;
    count(where: Where<WatchList> | undefined): Promise<Count>;
    find(userId: number, limit: number, offset: number): Promise<WatchList[]>;
    searchWatchList(userId: number, search: string, limit: number, offset: number): Promise<any>;
    findById(id: number, userId: number): Promise<WatchList | null>;
    updateById(id: number, userId: number, watchList: Partial<WatchList>): Promise<Count>;
    deleteById(id: number, userId: number): Promise<{
        count: number;
    }>;
    setAlertForWatchList(watchListId: number, userId: number, amount: number): Promise<number>;
    removeAlertForWatchList(notificationId: number, userId: number): Promise<number>;
}
