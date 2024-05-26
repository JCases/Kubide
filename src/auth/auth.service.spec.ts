import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let userService: UserService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let jwtService: JwtService;

  const mockUserService = {
    userWithPassword: jest.fn(),
  };

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: mockUserService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = {
        id: '1',
        email,
        password:
          '$2a$10$D8wdIBz5Deq6Ia7ogEUSq.SOnrGKQMWhuf3lpZRIT5oL6pK0H/G0W',
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockUserService.userWithPassword.mockResolvedValue(user);
      mockJwtService.signAsync.mockResolvedValue('token');

      const result = await service.signIn(email, password);

      expect(result).toEqual({ access_token: 'token' });
      expect(mockUserService.userWithPassword).toHaveBeenCalledWith({ email });
      expect(mockJwtService.signAsync).toHaveBeenCalledWith({
        email: user.email,
        sub: user.id,
      });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const user = { id: '1', email, password: 'wrongpassword' };

      mockUserService.userWithPassword.mockResolvedValue(user);

      const result = service.signIn(email, password);

      await expect(result).rejects.toThrow(UnauthorizedException);
      expect(mockUserService.userWithPassword).toHaveBeenCalledWith({ email });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const email = 'test@example.com';
      const password = 'password';

      mockUserService.userWithPassword.mockResolvedValue(null);

      const result = service.signIn(email, password);

      await expect(result).rejects.toThrow(UnauthorizedException);
      expect(mockUserService.userWithPassword).toHaveBeenCalledWith({ email });
    });
  });
});
