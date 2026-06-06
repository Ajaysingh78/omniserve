import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { SubscriptionPlan, SubscriptionStatus } from '../../common/enums';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface ISubscription {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  plan: SubscriptionPlan;
  amount: number;
  startDate: Date;
  endDate: Date;
  status: SubscriptionStatus;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type SubscriptionDocument = ISubscription & Document;

@Schema(baseSchemaOptions)
export class Subscription {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(SubscriptionPlan), required: true })
  plan: SubscriptionPlan;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: Date, required: true })
  startDate: Date;

  @Prop({ type: Date, required: true })
  endDate: Date;

  @Prop({ type: String, enum: Object.values(SubscriptionStatus), default: SubscriptionStatus.TRIAL })
  status: SubscriptionStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

SubscriptionSchema.index({ tenantId: 1, status: 1 });
SubscriptionSchema.index({ endDate: 1 });

applySoftDeleteMiddleware(SubscriptionSchema);
