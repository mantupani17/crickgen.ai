import { Module } from '@nestjs/common';
import { AuthWrapperController } from './auth-wrapper.controller';
import { AuthWrapperService } from './auth-wrapper.service';
import { AxiosService } from '../common/axios-service';

@Module({
  controllers: [AuthWrapperController],
  providers: [AuthWrapperService, AxiosService]
})
export class AuthWrapperModule {}
