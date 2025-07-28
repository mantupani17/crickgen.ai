import {
  IsString,
  IsOptional,
  IsNotEmpty,
  IsMongoId,
  IsNumber,
  IsObject,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateChatHistoryDto {
  userId: number;

  @IsString()
  @IsNotEmpty()
  prompt: string;
  
  response: any;
  
  @IsString()
  @IsNotEmpty()
  sessionId: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  temperature?: number;

  @IsOptional()
  @IsObject()
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  latencyMs?: number;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsEnum(['success', 'error'])
  status?: 'success' | 'error';

  @IsOptional()
  @IsString()
  errorMessage?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}
