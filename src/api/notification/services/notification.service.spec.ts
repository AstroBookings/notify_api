import { EventDto } from '@api/notification/models/event.dto';
import { Notification } from '@api/notification/models/notification.type';
import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IdService } from '@shared/id.service';
import { NotificationsBuilderFactory } from './notification-builders/notifications-builder.factory';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';
import { TemplateEntity } from './template.entity';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockNotificationRepository: Partial<jest.Mocked<EntityRepository<NotificationEntity>>>;
  let mockTemplateRepository: Partial<jest.Mocked<EntityRepository<TemplateEntity>>>;
  let mockEntityManager: Partial<jest.Mocked<EntityManager>>;
  let mockIdService: Partial<jest.Mocked<IdService>>;

  const mockId = 'notif_1';
  const mockEvent: EventDto = {
    name: 'launch_scheduled',
    data: 'lnch_1',
  };
  const mockNotification: NotificationEntity = {
    id: mockId,
    userId: 'usr_a1',
    subject: 'Launch Artemis I scheduled',
    message:
      'The launch Artemis I to Moon has been scheduled for 2025-07-20. \n We will send you a notification when the launch is confirmed',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    data: {
      launch_id: 'lnch_1',
      destination: 'Moon',
      date: '2025-07-20',
    },
    template: {
      id: 'tmpl_1',
      eventName: 'launch_scheduled',
      subject: 'Launch Artemis I scheduled',
      message:
        'The launch Artemis I to Moon has been scheduled for 2025-07-20. \n We will send you a notification when the launch is confirmed',
      notifications: [],
    },
  };

  beforeEach(async () => {
    mockNotificationRepository = {
      find: jest.fn(),
      findOne: jest.fn(),
      insert: jest.fn(),
      upsert: jest.fn(),
    };
    mockTemplateRepository = {
      findOne: jest.fn(),
    };
    mockEntityManager = {
      flush: jest.fn(),
    };
    mockIdService = {
      generateId: jest.fn().mockReturnValue(mockId),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(NotificationEntity),
          useValue: mockNotificationRepository,
        },
        {
          provide: getRepositoryToken(TemplateEntity),
          useValue: mockTemplateRepository,
        },
        {
          provide: EntityManager,
          useValue: mockEntityManager,
        },
        {
          provide: IdService,
          useValue: mockIdService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });
  describe('sendNotification', () => {
    it('should send a notification and update its status', async () => {
      // Arrange
      const expectedNotification: Notification = {
        id: mockId,
        userId: 'usr_a1',
        subject: 'Launch Artemis I scheduled',
        message:
          'The launch Artemis I to Moon has been scheduled for 2025-07-20. \n We will send you a notification when the launch is confirmed',
        status: 'sent',
      };
      mockNotificationRepository.findOne.mockResolvedValue({
        ...mockNotification,
        status: 'sent',
      } as any);

      // Act
      const actualResult = await service.sendNotification(mockId);

      // Assert
      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({ id: mockId, status: 'pending' });
      expect(actualResult).toEqual(expectedNotification);
    });

    it('should throw NotFoundException if pending notification is not found', async () => {
      // Arrange
      const inputId = 'non_existent_id';
      mockNotificationRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.sendNotification(inputId)).rejects.toThrow(NotFoundException);
      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({ id: inputId, status: 'pending' });
    });
  });

  describe('saveNotifications', () => {
    it('should save notifications based on the provided event', async () => {
      // Arrange
      const mockBuiltNotifications = [mockNotification];
      jest.spyOn(NotificationsBuilderFactory.prototype, 'createNotificationsBuilder').mockReturnValue({
        build: jest.fn().mockResolvedValue(mockBuiltNotifications),
      } as any);

      // Act
      const result = await service.saveNotifications(mockEvent);

      // Assert
      expect(mockNotificationRepository.insert).toHaveBeenCalledWith(mockNotification);
      const expected = [
        {
          id: mockId,
          userId: 'usr_a1',
          subject: 'Launch Artemis I scheduled',
          message:
            'The launch Artemis I to Moon has been scheduled for 2025-07-20. \n We will send you a notification when the launch is confirmed',
          status: 'pending',
        },
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('getPendingNotifications', () => {
    it('should return pending notifications', async () => {
      // Arrange
      mockNotificationRepository.find.mockResolvedValue([mockNotification]);

      // Act
      const result = await service.getPendingNotifications();

      // Assert
      expect(mockNotificationRepository.find).toHaveBeenCalledWith(
        { status: 'pending' },
        { orderBy: { createdAt: 'ASC' } },
      );
      const expected = [
        {
          id: mockId,
          userId: 'usr_a1',
          subject: 'Launch Artemis I scheduled',
          message:
            'The launch Artemis I to Moon has been scheduled for 2025-07-20. \n We will send you a notification when the launch is confirmed',
          status: 'pending',
        },
      ];
      expect(result).toEqual(expected);
    });
  });

  describe('sendNotification', () => {
    it('should send a notification', async () => {
      // Arrange
      mockNotificationRepository.findOne.mockResolvedValue(mockNotification);

      // Act
      const result = await service.sendNotification(mockId);

      // Assert
      expect(mockNotificationRepository.findOne).toHaveBeenCalledWith({ id: mockId, status: 'pending' });
      expect(mockNotificationRepository.upsert).toHaveBeenCalled();
      expect(mockEntityManager.flush).toHaveBeenCalled();
      const expected = {
        id: mockId,
        userId: 'usr_a1',
        subject: 'Launch Artemis I scheduled',
        message:
          'The launch Artemis I to Moon has been scheduled for 2025-07-20. \n We will send you a notification when the launch is confirmed',
        status: 'sent',
      };
      expect(result).toEqual(expected);
    });

    it('should throw NotFoundException if notification is not found', async () => {
      // Arrange
      mockNotificationRepository.findOne.mockResolvedValue(null);

      // Act & Assert
      await expect(service.sendNotification(mockId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getUserPendingNotifications', () => {
    it('should return and update user pending notifications', async () => {
      // Arrange
      mockNotificationRepository.find.mockResolvedValue([mockNotification]);

      // Act
      const result = await service.getUserPendingNotifications('123');

      // Assert
      expect(mockNotificationRepository.find).toHaveBeenCalledWith(
        { userId: '123', status: 'pending' },
        { orderBy: { createdAt: 'ASC' }, limit: 10 },
      );
      expect(mockNotificationRepository.upsert).toHaveBeenCalled();
      expect(mockEntityManager.flush).toHaveBeenCalled();
      const expected = [
        {
          id: mockId,
          userId: 'usr_a1',
          subject: 'Launch Artemis I scheduled',
          message:
            'The launch Artemis I to Moon has been scheduled for 2025-07-20. \n We will send you a notification when the launch is confirmed',
          status: 'read',
        },
      ];
      expect(result).toEqual(expected);
    });
  });
});
