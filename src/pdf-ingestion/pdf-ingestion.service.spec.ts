import { Test, TestingModule } from '@nestjs/testing';
import { PdfIngestionService } from './pdf-ingestion.service';

describe('PdfIngestionService', () => {
  let service: PdfIngestionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdfIngestionService],
    }).compile();

    service = module.get<PdfIngestionService>(PdfIngestionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
