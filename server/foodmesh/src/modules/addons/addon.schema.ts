import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IAddon {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  menuItemId: Types.ObjectId;
  name: string;
  price: number;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type AddonDocument = IAddon & Document;

@Schema(baseSchemaOptions)
export class Addon {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'MenuItem', required: true, index: true })
  menuItemId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 150 })
  name: string;

  @Prop({ type: Number, required: true, min: 0 })
  price: number;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const AddonSchema = SchemaFactory.createForClass(Addon);

AddonSchema.index({ tenantId: 1, menuItemId: 1 });

applySoftDeleteMiddleware(AddonSchema);
