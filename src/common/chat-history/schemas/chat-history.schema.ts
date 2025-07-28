import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatHistoryDocument = ChatHistory & Document;

@Schema({ timestamps: true })
export class ChatHistory {
  @Prop({ required: true })
  userId: number;

  @Prop({ required: true })
  prompt: string;

  @Prop({ required: true, type: Object })
  response: any;

  @Prop()
  model?: string; // e.g. gpt-4, gpt-3.5-turbo, gemini-pro

  @Prop()
  temperature?: number;

  @Prop({type: Object})
  tokenUsage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };

  @Prop()
  latencyMs?: number; // response time

  @Prop()
  conversationId?: string;

  @Prop({ enum: ['success', 'error'], default: 'success' })
  status: 'success' | 'error';

  @Prop()
  errorMessage?: string;

  @Prop({type: Object})
  metadata?: Record<string, any>; // optional payload, headers, etc.

  @Prop({type: String})
  sessionId: string
}

export const ChatHistorySchema = SchemaFactory.createForClass(ChatHistory);
