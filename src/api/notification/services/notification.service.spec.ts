import { EntityManager, EntityRepository } from '@mikro-orm/core';
import { getRepositoryToken } from '@mikro-orm/nestjs';
import { Test, TestingModule } from '@nestjs/testing';
import { IdService } from '../../../shared/id.service';
import { NotificationEntity } from './notification.entity';
import { NotificationService } from './notification.service';
import { TemplateEntity } from './template.entity';

describe('NotificationService', () => {
  let service: NotificationService;
  let notificationRepository: EntityRepository<NotificationEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: getRepositoryToken(NotificationEntity),
          useClass: EntityRepository,
        },
        {
          provide: getRepositoryToken(TemplateEntity),
          useClass: EntityRepository,
        },
        {
          provide: EntityManager,
          useValue: {},
        },
        {
          provide: IdService,
          useValue: { generateId: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    notificationRepository = module.get<EntityRepository<NotificationEntity>>(getRepositoryToken(NotificationEntity));
  });

  // ... otros tests ...

  describe('getUserPendingNotifications', () => {
    it('should return top 10 pending notifications for user', async () => {
      const userId = 'user123';
      const mockNotifications = [{ id: '1', userId, subject: 'Test', message: 'Test message', status: 'pending' }];
      jest.spyOn(notificationRepository, 'find').mockResolvedValue(mockNotifications as NotificationEntity[]);

      const result = await service.getUserPendingNotifications(userId);

      expect(result).toEqual(mockNotifications);
      expect(notificationRepository.find).toHaveBeenCalledWith(
        { userId, status: 'pending' },
        { orderBy: { createdAt: 'ASC' }, limit: 10 },
      );
    });
  });
});
