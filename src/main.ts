import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GenerateSwagger, LoggingInterceptor, setupOpenTelemetry, appConfig } from 'common-core-pkg';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import * as express from 'express'
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  
  (await setupOpenTelemetry({
    appName:'crickgen-ai',
    appVersion: '1.0.0',
    deplomentEnv: 'Local',
    traceUrl: 'http://13.223.184.1:4318/v1/traces'
  })).start()

  const app = await NestFactory.create<NestExpressApplication>(AppModule, appConfig);

  const cfgService = app.get(ConfigService)
  const port = cfgService.get('PORT')
  app.setGlobalPrefix('api/v1')
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.use('/uploads', express.static('uploads')); 

  GenerateSwagger.generate(app as any, {
    description: 'Cricket gen AI API Details',
    title: "Crickgen.ai",
    serverUrl: `http://localhost:${port}/api/v1`,
    version: '1.0.0'
  })


  app.enableCors({
    origin: cfgService.get<string>("ALLOWED_ORIGINS").split(','),
    methods: "*",
  });

  await app.listen(port);
}
bootstrap();
