import { Test, TestingModule } from '@nestjs/testing';
import { AuthWrapperController } from './auth-wrapper.controller';

describe('AuthWrapperController', () => {
  let controller: AuthWrapperController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthWrapperController],
    }).compile();

    controller = module.get<AuthWrapperController>(AuthWrapperController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
