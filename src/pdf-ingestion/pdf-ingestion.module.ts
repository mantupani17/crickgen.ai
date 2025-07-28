import { Module } from '@nestjs/common';
import { PdfIngestionService } from './pdf-ingestion.service';
import { PdfIngestionController } from './pdf-ingestion.controller';
import { ChatHistoryService } from 'src/common/chat-history/chat-history.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatHistory, ChatHistorySchema } from '../common/chat-history/schemas/chat-history.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatHistory.name, schema: ChatHistorySchema}
    ])
  ],
  providers: [PdfIngestionService, ChatHistoryService],
  controllers: [PdfIngestionController]
})
export class PdfIngestionModule {}
