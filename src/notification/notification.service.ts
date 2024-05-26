import { Injectable } from '@nestjs/common';
import { PrismaService } from '../utils/prisma.service';
import { Notification, Prisma } from '@prisma/client';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  async notification(
    notificationWhereUniqueInput: Prisma.NotificationWhereUniqueInput,
  ): Promise<Notification | null> {
    return this.prisma.notification.findUnique({
      where: notificationWhereUniqueInput,
    });
  }

  async notifications(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.NotificationWhereUniqueInput;
    where?: Prisma.NotificationWhereInput;
    orderBy?: Prisma.NotificationOrderByWithRelationInput;
  }): Promise<Notification[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.prisma.notification.findMany({
      skip,
      take,
      cursor,
      where,
      orderBy,
    });
  }

  async createNotification(
    data: Prisma.NotificationCreateInput,
  ): Promise<Notification> {
    return this.prisma.notification.create({
      data,
    });
  }

  async updateNotification(params: {
    where: Prisma.NotificationWhereUniqueInput;
    data: Prisma.NotificationUpdateInput;
  }): Promise<Notification> {
    const { where, data } = params;
    return this.prisma.notification.update({
      data,
      where,
    });
  }

  async updateNotifications(params: {
    where: Prisma.NotificationWhereInput;
    data: Prisma.NotificationUpdateInput;
  }): Promise<Notification[]> {
    const { where, data } = params;
    await this.prisma.notification.updateMany({
      data,
      where,
    });

    return this.notifications({
      where,
    });
  }

  async deleteNotification(
    where: Prisma.NotificationWhereUniqueInput,
  ): Promise<Notification> {
    return this.prisma.notification.delete({
      where,
    });
  }
}
