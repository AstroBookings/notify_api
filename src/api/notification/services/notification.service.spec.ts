import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { IdService } from '../../../shared/id.service';
import { EventDto } from '../models/event.dto';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';
import { TemplateEntity } from './template.entity';

describe('NotificationService', () => {
  let service: NotificationService;
  let mockNotificationRepository: Partial<jest.Mocked<EntityRepository<NotificationEntity>>>;
  let mockTemplateRepository: Partial<jest.Mocked<EntityRepository<TemplateEntity>>>;
  let mockEntityManager: Partial<jest.Mocked<EntityManager>>;
  let mockIdService: Partial<jest.Mocked<IdService>>;
  beforeEach(async () => {
    mockNotificationRepository = {
      insert: jest.fn().mockResolvedValue([]),
      find: jest.fn(),
      findOne: jest.fn(),
      upsert: jest.fn(),
    };
    mockTemplateRepository = {
      findOne: jest.fn().mockResolvedValue(null),
    };
    mockEntityManager = {
      getConnection: jest.fn().mockReturnValue({
        execute: jest.fn().mockResolvedValue([]),
      }),
    };
    mockIdService = {
      generateId: jest.fn().mockReturnValue('123'),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
        NotificationService,
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('saveNotifications', () => {
    it('should throw an error if template is not found', () => {
      const eventDto: EventDto = {
        name: 'launch_scheduled',
        data: 'Test Data',
      };
      expect(service.saveNotifications(eventDto)).rejects.toThrow('Template not found for event: launch_scheduled');
    });
  });
  describe('getPendingNotifications', () => {
    it('should return an array of pending notifications', async () => {
      const mockPendingNotifications = [
        {
          id: '1',
          userId: 'user1',
          subject: 'Test Subject 1',
          message: 'Test Message 1',
          status: 'pending',
          data: {},
          createdAt: new Date('2023-01-01'),
        },
        {
          id: '2',
          userId: 'user2',
          subject: 'Test Subject 2',
          message: 'Test Message 2',
          status: 'pending',
          data: {},
          createdAt: new Date('2023-01-02'),
        },
      ];

      mockNotificationRepository.find.mockResolvedValue(mockPendingNotifications);

      const result = await service.getPendingNotifications();

      expect(result).toHaveLength(2);
      expect(mockNotificationRepository.find).toHaveBeenCalledWith(
        { status: 'pending' },
        { orderBy: { createdAt: 'ASC' } },
      );
    });

    it('should return an empty array when no pending notifications', async () => {
      mockNotificationRepository.find.mockResolvedValue([]);

      const result = await service.getPendingNotifications();

      expect(result).toEqual([]);
      expect(mockNotificationRepository.find).toHaveBeenCalledWith(
        { status: 'pending' },
        { orderBy: { createdAt: 'ASC' } },
      );
    });
  });
  describe('sendNotification', () => {
    it('should mark a pending notification as sent', async () => {
      const mockNotification = {
        id: '123',
        userId: 'user1',
        subject: 'Test Subject',
        message: 'Test Message',
        status: 'pending',
        updatedAt: new Date('2023-01-01'),
        flush: jest.fn(),
      };

      mockNotificationRepository.findOne = jest.fn().mockResolvedValue(mockNotification);

      const result = await service.sendNotification('123');

      expect(result).toEqual({
        id: '123',
        userId: 'user1',
        subject: 'Test Subject',
        message: 'Test Message',
        status: 'sent',
      });
      expect(mockNotification.status).toBe('sent');
      expect(mockNotification.updatedAt).toBeInstanceOf(Date);
      expect(mockNotification.updatedAt).not.toEqual(new Date('2023-01-01'));
      expect(mockNotificationRepository.upsert).toHaveBeenCalled();
    });

    it('should throw NotFoundException if pending notification is not found', async () => {
      mockNotificationRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.sendNotification('123')).rejects.toThrow(NotFoundException);
    });
  });
});
