import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IReviewAnalytics {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  outletId: Types.ObjectId;
  source: string;
  reviewText: string;
  sentimentScore: number;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type ReviewAnalyticsDocument = IReviewAnalytics & Document;

@Schema(baseSchemaOptions)
export class ReviewAnalytics {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Outlet', required: true, index: true })
  outletId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  source: string;

  @Prop({ type: String, required: true, maxlength: 5000 })
  reviewText: string;

  @Prop({ type: Number, required: true, min: -1, max: 1 })
  sentimentScore: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const ReviewAnalyticsSchema = SchemaFactory.createForClass(ReviewAnalytics);

ReviewAnalyticsSchema.index({ tenantId: 1, outletId: 1 });
ReviewAnalyticsSchema.index({ source: 1 });
ReviewAnalyticsSchema.index({ sentimentScore: 1 });

applySoftDeleteMiddleware(ReviewAnalyticsSchema);
