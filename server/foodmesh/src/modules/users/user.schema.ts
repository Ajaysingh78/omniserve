import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { UserRole, UserStatus } from '../../common/enums';
import { baseSchemaOptions, applySoftDeleteMiddleware } from '../../common/schemas/base.schema';

export interface IUser {
  _id: Types.ObjectId;
  tenantId: Types.ObjectId;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  passwordHash: string;
  role: UserRole;
  status: UserStatus;
  lastLogin: Date | null;
  createdBy: Types.ObjectId | null;
  updatedBy: Types.ObjectId | null;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName: string;
}

export type UserDocument = IUser & Document;

@Schema(baseSchemaOptions)
export class User {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tenant', required: true, index: true })
  tenantId: Types.ObjectId;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  firstName: string;

  @Prop({ type: String, required: true, trim: true, maxlength: 100 })
  lastName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Invalid email format'],
  })
  email: string;

  @Prop({ type: String, required: true, trim: true })
  phone: string;

  @Prop({ type: String, required: true, select: false })
  passwordHash: string;

  @Prop({ type: String, enum: Object.values(UserRole), default: UserRole.STAFF })
  role: UserRole;

  @Prop({ type: String, enum: Object.values(UserStatus), default: UserStatus.PENDING_VERIFICATION })
  status: UserStatus;

  @Prop({ type: Date, default: null })
  lastLogin: Date | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  createdBy: Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  updatedBy: Types.ObjectId | null;

  @Prop({ type: Boolean, default: false, index: true })
  isDeleted: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.virtual('fullName').get(function (this: UserDocument) {
  return `${this.firstName} ${this.lastName}`;
});

UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ tenantId: 1 });
UserSchema.index({ tenantId: 1, status: 1 });
UserSchema.index({ tenantId: 1, role: 1 });
UserSchema.index({ phone: 1, tenantId: 1 });

applySoftDeleteMiddleware(UserSchema);
