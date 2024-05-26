import { Test, TestingModule } from '@nestjs/testing';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';

describe('NotificationController', () => {
  let controller: NotificationController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: NotificationService;

  const mockNotificationService = {
    updateNotifications: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationController],
      providers: [
        {
          provide: NotificationService,
          useValue: mockNotificationService,
        },
      ],
    }).compile();

    controller = module.get<NotificationController>(NotificationController);
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getNotifications', () => {
    it('should update notifications and return them', async () => {
      const req = { user: { sub: '1' } };
      const updatedNotifications = [
        {
          id: '1',
          userId: req.user.sub,
          messageId: '1',
          read: true,
        },
        {
          id: '2',
          userId: req.user.sub,
          messageId: '2',
          read: true,
        },
      ];
      mockNotificationService.updateNotifications.mockResolvedValue(
        updatedNotifications,
      );

      const result = await controller.getNotifications(req);

      expect(result).toEqual(updatedNotifications);
      expect(service.updateNotifications).toHaveBeenCalledWith({
        where: {
          user: { id: req.user.sub },
        },
        data: {
          read: true,
        },
      });
    });
  });
});
