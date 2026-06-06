import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { OrderStatus, PaymentStatus, OrderSource } from '../../common/enums';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IOrder {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  outletId: Types.ObjectId;
  customerId: Types.ObjectId;
  source: OrderSource;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  discount: number;
  totalAmount: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  acceptedAt: Date | null;
  preparedAt: Date | null;
  deliveredAt: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderDocument = IOrder & Document;

@Schema(baseSchemaOptions)
export class Order {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Outlet', required: true, index: true })
  outletId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Customer', required: true, index: true })
  customerId: Types.ObjectId;

  @Prop({ type: String, enum: Object.values(OrderSource), required: true })
  source: OrderSource;

  @Prop({ type: Number, required: true, min: 0 })
  subtotal: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  tax: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  deliveryFee: number;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  discount: number;

  @Prop({ type: Number, required: true, min: 0 })
  totalAmount: number;

  @Prop({ type: String, enum: Object.values(OrderStatus), default: OrderStatus.PENDING, index: true })
  orderStatus: OrderStatus;

  @Prop({ type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING })
  paymentStatus: PaymentStatus;

  @Prop({ type: Date, default: null })
  acceptedAt: Date | null;

  @Prop({ type: Date, default: null })
  preparedAt: Date | null;

  @Prop({ type: Date, default: null })
  deliveredAt: Date | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ tenantId: 1 });
OrderSchema.index({ tenantId: 1, outletId: 1 });
OrderSchema.index({ tenantId: 1, customerId: 1 });
OrderSchema.index({ tenantId: 1, orderStatus: 1 });
OrderSchema.index({ tenantId: 1, createdAt: -1 });
OrderSchema.index({ tenantId: 1, outletId: 1, orderStatus: 1, createdAt: -1 });

applySoftDeleteMiddleware(OrderSchema);
