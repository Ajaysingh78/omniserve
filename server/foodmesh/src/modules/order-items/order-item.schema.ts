import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions } from '../../common/schemas/base.schema';

export interface IOrderItem {
  _id: Types.ObjectId;
  orderId: Types.ObjectId;
  menuItemId: Types.ObjectId;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

export type OrderItemDocument = IOrderItem & Document;

@Schema(baseSchemaOptions)
export class OrderItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Order', required: true, index: true })
  orderId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MenuItem', required: true })
  menuItemId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1 })
  quantity: number;

  @Prop({ type: Number, required: true, min: 0 })
  unitPrice: number;

  @Prop({ type: Number, required: true, min: 0 })
  totalPrice: number;
}

export const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

OrderItemSchema.index({ orderId: 1 });
OrderItemSchema.index({ menuItemId: 1 });
