import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { PaymentStatus, PaymentMethod } from '../../common/enums';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IPayment {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  orderId: Types.ObjectId;
  transactionId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type PaymentDocument = IPayment & Document;

@Schema(baseSchemaOptions)
export class Payment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, unique: true })
  transactionId: string;

  @Prop({ type: String, enum: Object.values(PaymentMethod), required: true })
  paymentMethod: PaymentMethod;

  @Prop({ type: Number, required: true, min: 0 })
  amount: number;

  @Prop({ type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING })
  status: PaymentStatus;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ transactionId: 1 }, { unique: true });
PaymentSchema.index({ tenantId: 1, status: 1 });
PaymentSchema.index({ orderId: 1 });

applySoftDeleteMiddleware(PaymentSchema);
