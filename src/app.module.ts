import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MessageModule } from './message/message.module';
import { NotificationModule } from './notification/notification.module';

@Module({
  imports: [UserModule, MessageModule, NotificationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
