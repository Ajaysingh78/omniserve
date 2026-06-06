import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IWebhookLog {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  provider: string;
  eventType: string;
  payload: Record<string, unknown>;
  processed: boolean;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type WebhookLogDocument = IWebhookLog & Document;

@Schema(baseSchemaOptions)
export class WebhookLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 100, index: true })
  provider: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  eventType: string;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  payload: Record<string, unknown>;

  @Prop({ type: Boolean, default: false, index: true })
  processed: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const WebhookLogSchema = SchemaFactory.createForClass(WebhookLog);

WebhookLogSchema.index({ provider: 1 });
WebhookLogSchema.index({ processed: 1 });
WebhookLogSchema.index({ tenantId: 1, provider: 1, processed: 1 });

applySoftDeleteMiddleware(WebhookLogSchema);
