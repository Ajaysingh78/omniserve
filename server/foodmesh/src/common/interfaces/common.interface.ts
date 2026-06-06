import { Types } from 'mongoose';
import { DayOfWeek } from '../enums';

export interface IBaseDocument {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBusinessDocument extends IBaseDocument {
  tenantId: Types.ObjectId;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  deletedBy: Types.ObjectId | null;
}

export interface IGeoLocation {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

export interface IOperatingHour {
  day: DayOfWeek;
  openTime: string;  // HH:mm format
  closeTime: string; // HH:mm format
  isClosed: boolean;
}

export interface IAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}
