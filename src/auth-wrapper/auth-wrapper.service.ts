import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AxiosService } from '../common/axios-service';

@Injectable()
export class AuthWrapperService {
  constructor(private readonly axiosService: AxiosService) {}

  async signup(payload) {
    const resp = await this.axiosService.postRequest(
      '/auth/signup',
      {},
      payload,
    );
    if (!resp?.data) {
      throw new UnauthorizedException('UnAuthorized Access');
    }

    return resp.data;
  }

  async login(payload) {
    const resp = await this.axiosService.postRequest(
      '/auth/login',
      {},
      payload,
    );
    if (!resp?.data) {
      throw new UnauthorizedException('UnAuthorized Access');
    }

    return resp.data;
  }

  async logout(payload) {
    const resp = await this.axiosService.postRequest(
      '/auth/logout',
      {},
      payload,
    );
    if (!resp?.data) {
      throw new UnauthorizedException('UnAuthorized Access');
    }
    return resp.data;
  }
}
