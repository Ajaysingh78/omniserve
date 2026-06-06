import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface ICustomer {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}

export type CustomerDocument = ICustomer & Document;

@Schema(baseSchemaOptions)
export class Customer {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  firstName: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  lastName: string;

  @Prop({ type: String, required: true, lowercase: true, trim: true })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  phone: string;

  @Prop({ type: String, default: null, maxlength: 500 })
  address: string | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);

CustomerSchema.virtual('fullName').get(function (this: CustomerDocument) {
  return `${this.firstName} ${this.lastName}`;
});

CustomerSchema.index({ email: 1, tenantId: 1 });
CustomerSchema.index({ phone: 1, tenantId: 1 });
CustomerSchema.index({ tenantId: 1 });

applySoftDeleteMiddleware(CustomerSchema);
