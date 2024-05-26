import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';

import { Notification, Prisma } from '@prisma/client';
import { PrismaService } from '../utils/prisma.service';

describe('NotificationService', () => {
  let service: NotificationService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  const mockPrismaService = {
    notification: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('notification', () => {
    it('should return a notification if found', async () => {
      const notificationWhereUniqueInput: Prisma.NotificationWhereUniqueInput =
        { id: '1' };
      const expectedNotification: Notification = {
        id: '1',
        userId: '1',
        messageId: '1',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.notification.findUnique.mockResolvedValue(
        expectedNotification,
      );

      expect(await service.notification(notificationWhereUniqueInput)).toBe(
        expectedNotification,
      );
      expect(mockPrismaService.notification.findUnique).toHaveBeenCalledWith({
        where: notificationWhereUniqueInput,
      });
    });

    it('should return null if notification not found', async () => {
      const notificationWhereUniqueInput: Prisma.NotificationWhereUniqueInput =
        { id: '1' };

      mockPrismaService.notification.findUnique.mockResolvedValue(null);

      expect(
        await service.notification(notificationWhereUniqueInput),
      ).toBeNull();
      expect(mockPrismaService.notification.findUnique).toHaveBeenCalledWith({
        where: notificationWhereUniqueInput,
      });
    });
  });

  describe('notifications', () => {
    it('should return an array of notifications', async () => {
      const notifications: Notification[] = [
        {
          id: '1',
          userId: '1',
          messageId: '1',
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          userId: '2',
          messageId: '2',
          read: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.notification.findMany.mockResolvedValue(notifications);

      expect(await service.notifications({})).toBe(notifications);
      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('createNotification', () => {
    it('should create and return a notification', async () => {
      const createNotificationInput: Prisma.NotificationCreateInput = {
        user: { connect: { id: '1' } },
        message: { connect: { id: '1' } },
      };
      const expectedNotification: Notification = {
        id: '1',
        userId: '1',
        messageId: '1',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.notification.create.mockResolvedValue(
        expectedNotification,
      );

      expect(await service.createNotification(createNotificationInput)).toBe(
        expectedNotification,
      );
      expect(mockPrismaService.notification.create).toHaveBeenCalledWith({
        data: createNotificationInput,
      });
    });
  });

  describe('updateNotification', () => {
    it('should update and return a notification', async () => {
      const updateNotificationInput: Prisma.NotificationUpdateInput = {
        read: { set: true },
      };
      const whereNotificationInput: Prisma.NotificationWhereUniqueInput = {
        id: '1',
      };
      const expectedNotification: Notification = {
        id: '1',
        userId: '1',
        messageId: '1',
        read: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.notification.update.mockResolvedValue(
        expectedNotification,
      );

      expect(
        await service.updateNotification({
          where: whereNotificationInput,
          data: updateNotificationInput,
        }),
      ).toBe(expectedNotification);
      expect(mockPrismaService.notification.update).toHaveBeenCalledWith({
        data: updateNotificationInput,
        where: whereNotificationInput,
      });
    });
  });

  describe('updateNotifications', () => {
    it('should update multiple notifications', async () => {
      const updateNotificationsInput: Prisma.NotificationUpdateInput = {
        read: { set: true },
      };
      const whereNotificationsInput: Prisma.NotificationWhereInput = {
        user: { id: '1' },
      };

      const expectedUpdateNotifications: Prisma.BatchPayload = { count: 2 };
      const expectedNotifications: Notification[] = [
        {
          id: '1',
          userId: '1',
          messageId: '1',
          read: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.notification.updateMany.mockResolvedValue(
        expectedUpdateNotifications,
      );

      mockPrismaService.notification.findMany.mockResolvedValue(
        expectedNotifications,
      );

      expect(
        await service.updateNotifications({
          where: whereNotificationsInput,
          data: updateNotificationsInput,
        }),
      ).toBe(expectedNotifications);

      expect(mockPrismaService.notification.updateMany).toHaveBeenCalledWith({
        data: updateNotificationsInput,
        where: whereNotificationsInput,
      });

      expect(mockPrismaService.notification.findMany).toHaveBeenCalledWith({
        where: whereNotificationsInput,
      });
    });
  });

  describe('deleteNotification', () => {
    it('should delete and return a notification', async () => {
      const whereNotificationInput: Prisma.NotificationWhereUniqueInput = {
        id: '1',
      };
      const expectedNotification: Notification = {
        id: '1',
        userId: '1',
        messageId: '1',
        read: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.notification.delete.mockResolvedValue(
        expectedNotification,
      );

      expect(await service.deleteNotification(whereNotificationInput)).toBe(
        expectedNotification,
      );
      expect(mockPrismaService.notification.delete).toHaveBeenCalledWith({
        where: whereNotificationInput,
      });
    });
  });
});
