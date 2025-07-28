import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ScrapperModule } from './scrapper/scrapper.module';
import { GeminiService } from './gemini-service/gemini-service.service';
import { GeminiServiceModule } from './gemini-service/gemini-service.module';
import { RagModule } from './rag/rag.module';
import { ScrapperService } from './scrapper/scrapper.service';
import { RagService } from './rag/rag.service';
import { GoogleEmbeddingService } from './rag/google-embedding.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { OpenaiModule } from './openai/openai.module';
import { PdfIngestionModule } from './pdf-ingestion/pdf-ingestion.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuditInterceptor } from './common/audit/audit.interceptor';
import { AuditModule } from './common/audit/audit.module';
import { AxiosService } from './common/axios-service';
import { ValidateTokenMiddleware } from './common/middlewares/validate-token';
import { AuthWrapperModule } from './auth-wrapper/auth-wrapper.module';
import { ChatHistoryModule } from './common/chat-history/chat-history.module';

@Module({
  imports: [
    ScrapperModule, 
    GeminiServiceModule, 
    RagModule, 
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,    // ⏱ Time in seconds
          limit: 10,  // 🚫 Max requests per window
        },
      ],
    }),
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get<string>('MONGODB_DB')
      }),
      inject: [ConfigService],
    }),
    OpenaiModule,
    PdfIngestionModule,
    AuditModule,
    AuthWrapperModule,
    ChatHistoryModule
  ],
  controllers: [AppController],
  providers: [
    AxiosService,
    AppService, 
    GeminiService, 
    ScrapperService, 
    RagService, 
    GoogleEmbeddingService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: AuditInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(EncryptionMiddleware).forRoutes('*') // Apply encryption middleware if needed

    // consumer.apply(DecryptionMiddleware).forRoutes('*') // Apply decryption middleware if needed

    consumer.apply(ValidateTokenMiddleware).forRoutes('*')
  }
}
