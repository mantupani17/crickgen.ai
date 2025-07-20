import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { GeminiService } from 'src/gemini-service/gemini-service.service';
import { GoogleEmbeddingService } from './google-embedding.service';

@Module({
  providers: [RagService, GeminiService, GoogleEmbeddingService]
})
export class RagModule {}
