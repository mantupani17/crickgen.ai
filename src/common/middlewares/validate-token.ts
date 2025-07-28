import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common'
import { NextFunction } from 'express'
import { AxiosService } from '../axios-service'
import { ConfigService } from '@nestjs/config'
const excludeCsurfRoutes = [
      '/api/v1/auth/login',
      '/api/v1/auth/signup',
      '/profile',
      '/api/v1/auth/verify-email',
    ] // Define protected routes

@Injectable()
export class ValidateTokenMiddleware implements NestMiddleware {
  allowedSites: any = []
  constructor(private readonly axiosService: AxiosService, private readonly configService: ConfigService) {}
  
  async use(req, res, next: NextFunction) {
    if (!excludeCsurfRoutes.includes(req.baseUrl)) {
      const resp: any = await this.axiosService.postRequest('/auth/verify-access', {
          headers: {
              Authorization: req.headers.authorization
          }
      }, {
        clientSecret: this.configService.get<string>("APP_ID")
      })
      if (!resp?.data?.data) {
        throw new UnauthorizedException("UnAuthorized Access")
      }

      res.locals.user = resp.data.user
    }
    next()
  }
}
