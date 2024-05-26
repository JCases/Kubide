import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';

import { PrismaService } from '../utils/prisma.service';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [MessageController],
  providers: [MessageService, PrismaService],
})
export class MessageModule {}
