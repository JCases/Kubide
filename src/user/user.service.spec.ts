import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

import { User, Prisma } from '@prisma/client';
import { PrismaService } from './../prisma.service';

describe('UserService', () => {
  let service: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  const mockPrismaService = {
    user: {
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
        UserService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('user', () => {
    it('should return a user if found', async () => {
      const userWhereUniqueInput: Prisma.UserWhereUniqueInput = { id: '1' };
      const expectedUser: User = {
        id: '1',
        email: 'john@example.com',
        password: 'hashedpassword',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.findUnique.mockResolvedValue(expectedUser);

      expect(await service.user(userWhereUniqueInput)).toBe(expectedUser);
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: userWhereUniqueInput,
      });
    });

    it('should return null if user not found', async () => {
      const userWhereUniqueInput: Prisma.UserWhereUniqueInput = { id: '1' };

      mockPrismaService.user.findUnique.mockResolvedValue(null);

      expect(await service.user(userWhereUniqueInput)).toBeNull();
      expect(mockPrismaService.user.findUnique).toHaveBeenCalledWith({
        where: userWhereUniqueInput,
      });
    });
  });

  describe('users', () => {
    it('should return an array of users', async () => {
      const users: User[] = [
        {
          id: '1',
          email: 'john@example.com',
          password: 'hashedpassword',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: '2',
          email: 'jane@example.com',
          password: 'hashedpassword',
          active: true,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      mockPrismaService.user.findMany.mockResolvedValue(users);

      expect(await service.users({})).toBe(users);
      expect(mockPrismaService.user.findMany).toHaveBeenCalledWith({});
    });
  });

  describe('createUser', () => {
    it('should create and return a user', async () => {
      const createUserInput: Prisma.UserCreateInput = {
        email: 'john@example.com',
        password: 'hashedpassword',
        active: true,
      };
      const expectedUser: User = {
        id: '1',
        email: 'john@example.com',
        password: 'hashedpassword',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.create.mockResolvedValue(expectedUser);

      expect(await service.createUser(createUserInput)).toBe(expectedUser);
      expect(mockPrismaService.user.create).toHaveBeenCalledWith({
        data: createUserInput,
      });
    });
  });

  describe('updateUser', () => {
    it('should update and return a user', async () => {
      const updateUserInput: Prisma.UserUpdateInput = {
        email: { set: 'updated@example.com' },
      };
      const whereUserInput: Prisma.UserWhereUniqueInput = { id: '1' };
      const expectedUser: User = {
        id: '1',
        email: 'updated@example.com',
        password: 'hashedpassword',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.update.mockResolvedValue(expectedUser);

      expect(
        await service.updateUser({
          where: whereUserInput,
          data: updateUserInput,
        }),
      ).toBe(expectedUser);
      expect(mockPrismaService.user.update).toHaveBeenCalledWith({
        data: updateUserInput,
        where: whereUserInput,
      });
    });
  });

  describe('deleteUser', () => {
    it('should delete and return a user', async () => {
      const whereUserInput: Prisma.UserWhereUniqueInput = { id: '1' };
      const expectedUser: User = {
        id: '1',
        email: 'john@example.com',
        password: 'hashedpassword',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockPrismaService.user.delete.mockResolvedValue(expectedUser);

      expect(await service.deleteUser(whereUserInput)).toBe(expectedUser);
      expect(mockPrismaService.user.delete).toHaveBeenCalledWith({
        where: whereUserInput,
      });
    });
  });
});
