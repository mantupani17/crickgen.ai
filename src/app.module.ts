import { Module } from '@nestjs/common';
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

@Module({
  imports: [
    ScrapperModule, 
    GeminiServiceModule, 
    RagModule, 
    ConfigModule.forRoot({
      isGlobal: true
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    OpenaiModule,
  ],
  controllers: [AppController],
  providers: [AppService, GeminiService, ScrapperService, RagService, GoogleEmbeddingService],
})
export class AppModule {}
