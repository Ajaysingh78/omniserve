import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IAnalyticsDaily {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  outletId: Types.ObjectId;
  reportDate: Date;
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AnalyticsDailyDocument = IAnalyticsDaily & Document;

@Schema(baseSchemaOptions)
export class AnalyticsDaily {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Outlet', required: true, index: true })
  outletId: Types.ObjectId;

  @Prop({ type: Date, required: true, index: true })
  reportDate: Date;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalOrders: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  totalRevenue: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  averageOrderValue: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const AnalyticsDailySchema = SchemaFactory.createForClass(AnalyticsDaily);

AnalyticsDailySchema.index({ reportDate: 1 });
AnalyticsDailySchema.index({ outletId: 1, reportDate: -1 });
AnalyticsDailySchema.index({ tenantId: 1, outletId: 1, reportDate: -1 }, { unique: true });

applySoftDeleteMiddleware(AnalyticsDailySchema);
