import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';

import { UserController } from './user.controller';
import { UserService } from './user.service';
import { AuthService } from './../auth/auth.service';

import * as bcrypt from 'bcryptjs';

describe('UserController', () => {
  let controller: UserController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  const mockUserService = {
    user: jest.fn(),
    createUser: jest.fn(),
    updateUser: jest.fn(),
    users: jest.fn(),
  };

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signUp', () => {
    it('should throw BadRequestException if user already exists', async () => {
      const user = { email: 'test@example.com', password: 'password' };

      mockUserService.user.mockResolvedValue({ email: user.email });

      const result = controller.signUp(user);

      await expect(result).rejects.toThrow(BadRequestException);
      expect(mockUserService.user).toHaveBeenCalledWith({
        email: user.email,
      });
    });

    it('should create a new user and return an access token', async () => {
      const user = { email: 'test@example.com', password: 'password' };
      const hashedPassword = await bcrypt.hash(
        user.password,
        +process.env.BCRYPT_SALT!,
      );
      const token = { access_token: 'token' };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);

      mockUserService.user.mockResolvedValue(null);
      mockUserService.createUser.mockResolvedValue({ email: user.email });
      mockAuthService.signIn.mockResolvedValue(token);

      const result = await controller.signUp(user);

      expect(result).toBe(token);
      expect(mockUserService.user).toHaveBeenCalledWith({
        email: user.email,
      });
      expect(mockUserService.createUser).toHaveBeenCalledWith({
        email: user.email,
        password: hashedPassword,
      });
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        user.email,
        user.password,
      );
    });
  });

  describe('updateUser', () => {
    it('should update and return the user', async () => {
      const req = { user: { sub: 1 } };
      const updateUser = {
        email: 'updated@example.com',
        password: 'newpassword',
      };
      const hashedPassword = await bcrypt.hash(
        updateUser.password,
        +process.env.BCRYPT_SALT!,
      );

      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockUserService.updateUser.mockResolvedValue({
        id: 1,
        email: updateUser.email,
      });

      const result = await controller.updateUser(req, updateUser);

      expect(result).toEqual({ id: 1, email: updateUser.email });
      expect(mockUserService.updateUser).toHaveBeenCalledWith({
        where: { id: req.user.sub },
        data: {
          email: updateUser.email,
          password: hashedPassword,
        },
      });
    });
  });

  describe('getUser', () => {
    it('should return the user', async () => {
      const req = { user: { sub: 1 } };
      const user = { id: 1, email: 'test@example.com' };

      mockUserService.user.mockResolvedValue(user);

      const result = await controller.getUser(req);

      expect(result).toBe(user);
      expect(mockUserService.user).toHaveBeenCalledWith({ id: req.user.sub });
    });
  });

  describe('getUserActive', () => {
    it('should return the active status of the user', async () => {
      const req = { user: { sub: 1 } };
      const user = { id: 1, email: 'test@example.com', active: true };

      mockUserService.user.mockResolvedValue(user);

      const result = await controller.getUserActive(req);

      expect(result).toEqual({ active: true });
      expect(mockUserService.user).toHaveBeenCalledWith({ id: req.user.sub });
    });
  });

  describe('getActiveUsers', () => {
    it('should return a list of active users', async () => {
      const activeUsers = [
        { id: 1, email: 'active1@example.com', active: true },
        { id: 2, email: 'active2@example.com', active: true },
      ];

      mockUserService.users.mockResolvedValue(activeUsers);

      const result = await controller.getActiveUsers();

      expect(result).toBe(activeUsers);
      expect(mockUserService.users).toHaveBeenCalledWith({
        where: { active: true },
      });
    });
  });
});
