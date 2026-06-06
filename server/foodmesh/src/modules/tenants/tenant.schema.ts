import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { SubscriptionPlan } from '../../common/enums';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface ITenant {
  _id: Types.ObjectId;
  name: string;
  slug: string;
  ownerId: Types.ObjectId;
  subscriptionPlan: SubscriptionPlan;
  status: string;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type TenantDocument = ITenant & Document;

@Schema(baseSchemaOptions)
export class Tenant {
  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  name: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'],
  })
  slug: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  ownerId: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(SubscriptionPlan), default: SubscriptionPlan.FREE })
  subscriptionPlan: SubscriptionPlan;

  @Prop({ type: String, default: 'active' })
  status: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const TenantSchema = SchemaFactory.createForClass(Tenant);

TenantSchema.index({ slug: 1 }, { unique: true });
TenantSchema.index({ ownerId: 1 });
TenantSchema.index({ status: 1 });

applySoftDeleteMiddleware(TenantSchema);
