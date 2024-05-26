import { Controller, Get, Request } from '@nestjs/common';
import { NotificationService } from './notification.service';

@Controller('notification')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Get()
  getNotifications(@Request() req: any) {
    const id = req.user.sub;
    return this.notificationService.updateNotifications({
      where: {
        user: { id },
      },
      data: {
        read: true,
      },
    });
  }
}
