import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { OutletStatus, DayOfWeek } from '../../common/enums';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IOperatingHour {
  day: DayOfWeek;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface IGeoLocation {
  type: 'Point';
  coordinates: [number, number];
}

export interface IOutlet {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  restaurantId: Types.ObjectId;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  location: IGeoLocation;
  operatingHours: IOperatingHour[];
  status: OutletStatus;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OutletDocument = IOutlet & Document;

const OperatingHourSchema = new MongooseSchema(
  {
    day: { type: String, enum: Object.values(DayOfWeek), required: true },
    openTime: { type: String, required: true, match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format HH:mm'] },
    closeTime: { type: String, required: true, match: [/^([01]\d|2[0-3]):[0-5]\d$/, 'Invalid time format HH:mm'] },
    isOpen: { type: Boolean, default: true },
  },
  { _id: false },
);

@Schema(baseSchemaOptions)
export class Outlet {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Restaurant', required: true, index: true })
  restaurantId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  name: string;

  @Prop({ type: String, required: true, trim: true })
  phone: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  address: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  city: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  state: string;

  @Prop({ type: String, required: true, trim: true, match: [/^[1-9][0-9]{5}$/, 'Invalid Indian pincode'] })
  pincode: string;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: true,
      validate: {
        validator: (v: number[]) => v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90,
        message: 'Coordinates must be [longitude, latitude]',
      },
    },
  })
  location: IGeoLocation;

  @Prop({ type: [OperatingHourSchema], default: [] })
  operatingHours: IOperatingHour[];

  @Prop({ type: String, enum: Object.values(OutletStatus), default: OutletStatus.CLOSED })
  status: OutletStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const OutletSchema = SchemaFactory.createForClass(Outlet);

OutletSchema.index({ location: '2dsphere' });
OutletSchema.index({ tenantId: 1, restaurantId: 1 });
OutletSchema.index({ tenantId: 1, status: 1 });
OutletSchema.index({ city: 1, state: 1 });

applySoftDeleteMiddleware(OutletSchema);
