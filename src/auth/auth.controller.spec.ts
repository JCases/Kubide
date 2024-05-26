import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let authService: AuthService;

  const mockAuthService = {
    signIn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('signIn', () => {
    it('should return an access token if credentials are valid', async () => {
      const signIn = { email: 'test@example.com', password: 'password' };
      const token = { access_token: 'token' };

      mockAuthService.signIn.mockResolvedValue(token);

      const result = await controller.signIn(signIn);

      expect(result).toBe(token);
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        signIn.email,
        signIn.password,
      );
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const signIn = { email: 'test@example.com', password: 'password' };

      mockAuthService.signIn.mockRejectedValue(new UnauthorizedException());

      await expect(controller.signIn(signIn)).rejects.toThrow(
        UnauthorizedException,
      );
      expect(mockAuthService.signIn).toHaveBeenCalledWith(
        signIn.email,
        signIn.password,
      );
    });
  });
});
