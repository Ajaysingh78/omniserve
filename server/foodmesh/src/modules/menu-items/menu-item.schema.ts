import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IMenuItem {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  outletId: Types.ObjectId;
  categoryId: Types.ObjectId;
  name: string;
  description: string | null;
  image: string | null;
  sku: string | null;
  price: number;
  isVeg: boolean;
  isAvailable: boolean;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type MenuItemDocument = IMenuItem & Document;

@Schema(baseSchemaOptions)
export class MenuItem {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Outlet', required: true, index: true })
  outletId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Category', required: true, index: true })
  categoryId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 200 })
  name: string;

  @Prop({ type: String, default: null, maxlength: 1000 })
  description: string | null;

  @Prop({ type: String, default: null, trim: true })
  image: string | null;

  @Prop({ type: String, default: null, trim: true, maxlength: 100 })
  sku: string | null;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: Boolean, default: true })
  isVeg: boolean;

  @Prop({ type: Boolean, default: true })
  isAvailable: boolean;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const MenuItemSchema = SchemaFactory.createForClass(MenuItem);

MenuItemSchema.index({ tenantId: 1 });
MenuItemSchema.index({ tenantId: 1, outletId: 1 });
MenuItemSchema.index({ tenantId: 1, categoryId: 1 });
MenuItemSchema.index({ tenantId: 1, outletId: 1, name: 1 });
MenuItemSchema.index({ tenantId: 1, outletId: 1, isAvailable: 1 });
MenuItemSchema.index({ sku: 1, tenantId: 1 }, { sparse: true });

applySoftDeleteMiddleware(MenuItemSchema);
