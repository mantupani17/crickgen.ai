import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AuditLogDocument = AuditLog & Document;

@Schema({ timestamps: true })
export class AuditLog {
  @Prop()
  method: string;

  @Prop()
  route: string;

  @Prop()
  ip: string;

  @Prop()
  userAgent: string;

  @Prop({ type: Object })
  requestBody: any;

  @Prop({ type: Object })
  query: any;

  @Prop({ type: Object })
  params: any;

  @Prop({ type: Object })
  responseBody: any;

  @Prop()
  statusCode: number;

  @Prop()
  userId?: string;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);
