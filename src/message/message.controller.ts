import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Request,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { UserService } from './../user/user.service';

@Controller('message')
export class MessageController {
  constructor(
    private readonly messageService: MessageService,
    private readonly userService: UserService,
  ) {}

  @Post('send_message')
  async sendMessage(
    @Request() req: any,
    @Body() sendMessage: Record<string, string>,
  ) {
    const senderId = req.user.sub;
    const { text, receiverId } = sendMessage;

    // Check if user receiver exists and is active
    const userReceiver = await this.userService.user({ id: receiverId });
    if (!userReceiver || !userReceiver.active || userReceiver.id === senderId)
      throw new BadRequestException();

    return this.messageService.createMessage({
      text,
      sender: {
        connect: {
          id: senderId,
        },
      },
      receiver: {
        connect: {
          id: receiverId,
        },
      },
      notification: {
        create: {
          user: {
            connect: {
              id: receiverId,
            },
          },
        },
      },
    });
  }

  @Get()
  getMessages(@Request() req: any) {
    const id = req.user.sub;
    return this.messageService.messages({ where: { receiver: { id } } });
  }
}
