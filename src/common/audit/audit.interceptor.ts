import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();
    const request = context.switchToHttp().getRequest();
    const { method, originalUrl: route, ip, body, query, params, user } = request;
    const userAgent = request.get('user-agent');

    return next.handle().pipe(
      tap(async (responseBody) => {
        await this.auditService.log({
          method,
          route,
          ip,
          userAgent,
          requestBody: body,
          query,
          params,
          responseBody,
          statusCode: context.switchToHttp().getResponse().statusCode,
          userId: user?.id || null,
        });
      }),
    );
  }
}
