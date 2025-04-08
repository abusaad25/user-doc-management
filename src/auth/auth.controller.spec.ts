import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    register: jest.fn().mockResolvedValue({ id: 'user1' }),
    login: jest.fn().mockResolvedValue({ accessToken: 'jwt-token' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should register a new user', async () => {
    const dto = { username: 'test', password: 'pass' };
    const result = await controller.register(dto as any);
    expect(result).toEqual({ id: 'user1' });
    expect(mockAuthService.register).toHaveBeenCalledWith(dto);
  });

  it('should login a user', async () => {
    const dto = { username: 'test', password: 'pass' };
    const result = await controller.login(dto as any);
    expect(result).toEqual({ accessToken: 'jwt-token' });
    expect(mockAuthService.login).toHaveBeenCalledWith(dto);
  });

  it('should logout a user', async () => {
    const result = await controller.logout();
    expect(result).toEqual({ message: 'Logged out successfully' });
  });
});
