import { JwtModule } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { NotificationDto } from './models/notification.dto';
import { NotificationController } from './notification.controller';
import { NotificationService } from './services/notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [JwtModule],
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            saveNotifications: jest.fn(),
            getPendingNotifications: jest.fn(),
            getUserPendingNotifications: jest.fn(),
            sendNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getPendingNotifications', () => {
    it('should return an array of pending notifications', async () => {
      const result: NotificationDto[] = [
        { id: '1', userId: 'user1', subject: 'Test 1', message: 'Message 1', status: 'pending' },
        { id: '2', userId: 'user2', subject: 'Test 2', message: 'Message 2', status: 'pending' },
      ];
      jest.spyOn(service, 'getPendingNotifications').mockResolvedValue(result);

      expect(await controller.getPendingNotifications()).toBe(result);
      expect(service.getPendingNotifications).toHaveBeenCalled();
    });

    it('should return an empty array when no pending notifications', async () => {
      const result: NotificationDto[] = [];
      jest.spyOn(service, 'getPendingNotifications').mockResolvedValue(result);

      expect(await controller.getPendingNotifications()).toEqual([]);
      expect(service.getPendingNotifications).toHaveBeenCalled();
    });

    it('should handle errors from the service', async () => {
      jest.spyOn(service, 'getPendingNotifications').mockRejectedValue(new Error('Test error'));

      await expect(controller.getPendingNotifications()).rejects.toThrow('Test error');
      expect(service.getPendingNotifications).toHaveBeenCalled();
    });
  });

  describe('sendNotification', () => {
    it('should call notificationService.sendNotification and return the result', async () => {
      const mockNotification: NotificationDto = {
        id: '123',
        userId: 'user1',
        subject: 'Test Subject',
        message: 'Test Message',
        status: 'sent',
      };

      jest.spyOn(service, 'sendNotification').mockResolvedValue(mockNotification);

      const result = await controller.sendNotification('123');

      expect(result).toEqual(mockNotification);
      expect(service.sendNotification).toHaveBeenCalledWith('123');
    });
  });

  describe('getUserPendingNotifications', () => {
    it('should return top 10 pending notifications for user', async () => {
      const userId = 'user123';
      const expectedNotifications: NotificationDto[] = [
        { id: '1', userId, subject: 'Test', message: 'Test message', status: 'pending' },
      ];
      jest.spyOn(service, 'getUserPendingNotifications').mockResolvedValue(expectedNotifications);

      const result = await controller.getUserPendingNotifications(userId);

      expect(result).toEqual(expectedNotifications);
      expect(service.getUserPendingNotifications).toHaveBeenCalledWith(userId);
    });
  });
});
