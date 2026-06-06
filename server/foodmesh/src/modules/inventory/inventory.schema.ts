import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IInventory {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  outletId: Types.ObjectId;
  menuItemId: Types.ObjectId;
  quantity: number;
  threshold: number;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  isBelowThreshold: boolean;
}

export type InventoryDocument = IInventory & Document;

@Schema(baseSchemaOptions)
export class Inventory {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Outlet', required: true, index: true })
  outletId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MenuItem', required: true, index: true })
  menuItemId: Types.ObjectId;

  @Prop({ type: Number, required: true, min: 0, default: 0 })
  quantity: number;

  @Prop({ type: Number, required: true, min: 0, default: 10 })
  threshold: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const InventorySchema = SchemaFactory.createForClass(Inventory);

InventorySchema.virtual('isBelowThreshold').get(function (this: InventoryDocument) {
  return this.quantity <= this.threshold;
});

InventorySchema.index({ menuItemId: 1 });
InventorySchema.index({ outletId: 1 });
InventorySchema.index({ tenantId: 1, outletId: 1, menuItemId: 1 }, { unique: true });

applySoftDeleteMiddleware(InventorySchema);
