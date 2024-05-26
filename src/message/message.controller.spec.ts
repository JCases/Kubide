import { Test, TestingModule } from '@nestjs/testing';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { UserService } from './../user/user.service';

describe('MessageController', () => {
  let controller: MessageController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let messageService: MessageService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;

  const mockMessageService = {
    createMessage: jest.fn(),
    messages: jest.fn(),
  };

  const mockUserService = {
    user: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessageController],
      providers: [
        {
          provide: MessageService,
          useValue: mockMessageService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<MessageController>(MessageController);
    messageService = module.get<MessageService>(MessageService);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('sendMessage', () => {
    it('should send a message', async () => {
      const req = { user: { sub: '1' } };
      const userReceiver = { id: '2', active: true };
      const sendMessage = { text: 'Hello', receiverId: '2' };
      const createdMessage = {
        id: '1',
        text: 'Hello',
        senderId: req.user.sub,
        receiverId: '2',
      };

      mockUserService.user.mockResolvedValue(userReceiver);
      mockMessageService.createMessage.mockResolvedValue(createdMessage);

      const result = await controller.sendMessage(req, sendMessage);

      expect(result).toEqual(createdMessage);
      expect(userService.user).toHaveBeenCalledWith({ id: '2' });
      expect(messageService.createMessage).toHaveBeenCalledWith({
        text: sendMessage.text,
        sender: {
          connect: {
            id: req.user.sub,
          },
        },
        receiver: {
          connect: {
            id: sendMessage.receiverId,
          },
        },
        notification: {
          create: {
            user: {
              connect: {
                id: sendMessage.receiverId,
              },
            },
          },
        },
      });
    });
  });

  describe('getMessages', () => {
    it('should return a list of messages', async () => {
      const req = { user: { sub: '1' } };
      const messages = [
        { id: '1', text: 'Hello', senderId: '2', receiverId: req.user.sub },
        { id: '2', text: 'Hi', senderId: '3', receiverId: req.user.sub },
      ];

      mockMessageService.messages.mockResolvedValue(messages);

      const result = await controller.getMessages(req);

      expect(result).toEqual(messages);
      expect(messageService.messages).toHaveBeenCalledWith({
        where: { receiver: { id: req.user.sub } },
      });
    });
  });
});
