import { Module } from '@nestjs/common';
import { PdfIngestionService } from './pdf-ingestion.service';
import { PdfIngestionController } from './pdf-ingestion.controller';

@Module({
  providers: [PdfIngestionService],
  controllers: [PdfIngestionController]
})
export class PdfIngestionModule {}
