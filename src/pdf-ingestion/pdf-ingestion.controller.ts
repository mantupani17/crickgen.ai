import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { PdfIngestionService } from './pdf-ingestion.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { extname } from 'path';
import { diskStorage } from 'multer';
import { Throttle } from '@nestjs/throttler';

@Controller('pdf-ingestion')
export class PdfIngestionController {
  constructor(private readonly pdfService: PdfIngestionService) {}

  @Post()
  @Throttle({ default: { limit: 1, ttl: 30} })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        limits: { fileSize: 5 * 1024 * 1024 },
        destination: './uploads',
        filename: (_, file, callback) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(
            null,
            `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`,
          );
        },
      }),
      fileFilter: (_, file, callback) => {
        if (!file.originalname.match(/\.pdf$/)) {
          return callback(new Error('Only PDF files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
  )
  async handlePdfUpload(@UploadedFile() file: { path: string }) {
    if (!file) throw new Error('No file uploaded');
    const result = await this.pdfService.ingestPdf(file.path);
    return { message: 'File ingested successfully', result };
  }

  @Post('ask')
  async askWithPdfData(@Body('question') question: string) {
    return this.pdfService.ask(question);
  }
}
