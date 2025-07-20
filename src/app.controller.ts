// src/app.controller.ts
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ScrapperService } from './scrapper/scrapper.service';
import { GeminiService } from './gemini-service/gemini-service.service';
import { RagService } from './rag/rag.service';

@Controller()
export class AppController {
  constructor(
    private readonly scraperService: ScrapperService,
    private readonly geminiService: GeminiService,
    private readonly ragService: RagService
  ) {}

  @Post('/rag')
  async rag(
    @Body() body : {question: string }
  ) {
    const answer = await this.ragService.askFromWeb(body.question);
    return { answer };
  }

  @Get('/analyze')
  async analyze(@Query('url') url: string) {
    const content = await this.scraperService.scrape(url);
    const summary = await this.geminiService.generateContent(
      `Summarize the following content:\n\n${content}`
    );
    return { summary };
  }

  @Post('/ingest')
  async ingest(@Body() body : { url: string }) {
    const answer = await this.ragService.ingestURLDetails(body.url);
    return { answer };
  }
}
