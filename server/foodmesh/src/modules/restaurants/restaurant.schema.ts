import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { RestaurantStatus } from '../../common/enums';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IRestaurant {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  name: string;
  brandName: string;
  gstNumber: string | null;
  logoUrl: string | null;
  description: string | null;
  status: RestaurantStatus;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type RestaurantDocument = IRestaurant & Document;

@Schema(baseSchemaOptions)
export class Restaurant {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  name: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  brandName: string;

  @Prop({
    type: String,
    default: null,
    trim: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GST number'],
  })
  gstNumber: string | null;

  @Prop({ type: String, default: null, trim: true })
  logoUrl: string | null;

  @Prop({ type: String, default: null, maxlength: 1000 })
  description: string | null;

  @Prop({ type: String, enum: Object.values(RestaurantStatus), default: RestaurantStatus.PENDING_APPROVAL })
  status: RestaurantStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const RestaurantSchema = SchemaFactory.createForClass(Restaurant);

RestaurantSchema.index({ tenantId: 1 });
RestaurantSchema.index({ tenantId: 1, name: 1 });
RestaurantSchema.index({ tenantId: 1, status: 1 });

applySoftDeleteMiddleware(RestaurantSchema);
