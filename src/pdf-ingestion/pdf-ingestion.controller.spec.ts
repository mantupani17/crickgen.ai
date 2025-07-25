import { Test, TestingModule } from '@nestjs/testing';
import { PdfIngestionController } from './pdf-ingestion.controller';

describe('PdfIngestionController', () => {
  let controller: PdfIngestionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdfIngestionController],
    }).compile();

    controller = module.get<PdfIngestionController>(PdfIngestionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
