import { Test, TestingModule } from '@nestjs/testing';
import { MessageService } from './message.service';

import { Message, Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

describe('MessageService', () => {
  let service: MessageService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  const mockPrismaService = {
    message: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessageService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<MessageService>(MessageService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('message', () => {
    it('should return a message if found', async () => {
      const messageWhereUniqueInput: Prisma.MessageWhereUniqueInput = {
        id: '1',
      };
      const expectedMessage: Message = {
        id: '1',
        senderId: '1',
        receiverId: '2',
        text: 'Hello',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.message.findUnique.mockResolvedValue(expectedMessage);

      expect(await service.message(messageWhereUniqueInput)).toBe(
        expectedMessage,
      );
      expect(mockPrismaService.message.findUnique).toHaveBeenCalledWith({
        where: messageWhereUniqueInput,
      });
    });

    it('should return null if message not found', async () => {
      const messageWhereUniqueInput: Prisma.MessageWhereUniqueInput = {
        id: '1',
      };

      mockPrismaService.message.findUnique.mockResolvedValue(null);

      expect(await service.message(messageWhereUniqueInput)).toBeNull();
      expect(mockPrismaService.message.findUnique).toHaveBeenCalledWith({
        where: messageWhereUniqueInput,
      });
    });
  });

  describe('messages', () => {
    it('should return an array of messages', async () => {
      const messages: Message[] = [
        {
          id: '1',
          senderId: '1',
          receiverId: '2',
          text: 'Hello',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '1',
          senderId: '2',
          receiverId: '1',
          text: 'Hi',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.message.findMany.mockResolvedValue(messages);

      expect(await service.messages({})).toBe(messages);
      expect(mockPrismaService.message.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('createMessage', () => {
    it('should create and return a message', async () => {
      const createMessageInput: Prisma.MessageCreateInput = {
        sender: { connect: { id: '1' } },
        receiver: { connect: { id: '2' } },
        text: 'Hello',
      };
      const expectedMessage: Message = {
        id: '1',
        senderId: '1',
        receiverId: '2',
        text: 'Hello',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.message.create.mockResolvedValue(expectedMessage);

      expect(await service.createMessage(createMessageInput)).toBe(
        expectedMessage,
      );
      expect(mockPrismaService.message.create).toHaveBeenCalledWith({
        data: createMessageInput,
      });
    });
  });

  describe('updateMessage', () => {
    it('should update and return a message', async () => {
      const updateMessageInput: Prisma.MessageUpdateInput = {
        text: { set: 'Hello Updated' },
      };
      const whereMessageInput: Prisma.MessageWhereUniqueInput = { id: '1' };
      const expectedMessage: Message = {
        id: '1',
        senderId: '1',
        receiverId: '2',
        text: 'Hello Updated',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.message.update.mockResolvedValue(expectedMessage);

      expect(
        await service.updateMessage({
          where: whereMessageInput,
          data: updateMessageInput,
        }),
      ).toBe(expectedMessage);
      expect(mockPrismaService.message.update).toHaveBeenCalledWith({
        data: updateMessageInput,
        where: whereMessageInput,
      });
    });
  });

  describe('deleteMessage', () => {
    it('should delete and return a message', async () => {
      const whereMessageInput: Prisma.MessageWhereUniqueInput = { id: '1' };
      const expectedMessage: Message = {
        id: '1',
        senderId: '1',
        receiverId: '2',
        text: 'Hello',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.message.delete.mockResolvedValue(expectedMessage);

      expect(await service.deleteMessage(whereMessageInput)).toBe(
        expectedMessage,
      );
      expect(mockPrismaService.message.delete).toHaveBeenCalledWith({
        where: whereMessageInput,
      });
    });
  });
});
