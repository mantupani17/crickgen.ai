import { Test, TestingModule } from '@nestjs/testing';
import { AuthWrapperService } from './auth-wrapper.service';

describe('AuthWrapperService', () => {
  let service: AuthWrapperService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthWrapperService],
    }).compile();

    service = module.get<AuthWrapperService>(AuthWrapperService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
