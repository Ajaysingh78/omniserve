import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions } from '../../common/schemas/base.schema';

export interface IAuditLog {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  userId: Types.ObjectId;
  action: string;
  entityType: string;
  entityId: Types.ObjectId;
  oldData: Record<string, unknown> | null;
  newData: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

export type AuditLogDocument = IAuditLog & Document;

@Schema(baseSchemaOptions)
export class AuditLog {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  action: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100, index: true })
  entityType: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, required: true, index: true })
  entityId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  oldData: Record<string, unknown> | null;

  @Prop({ type: MongooseSchema.Types.Mixed, default: null })
  newData: Record<string, unknown> | null;
}

export const AuditLogSchema = SchemaFactory.createForClass(AuditLog);

AuditLogSchema.index({ tenantId: 1 });
AuditLogSchema.index({ entityType: 1, entityId: 1 });
AuditLogSchema.index({ tenantId: 1, entityType: 1, entityId: 1 });
AuditLogSchema.index({ tenantId: 1, createdAt: -1 });
