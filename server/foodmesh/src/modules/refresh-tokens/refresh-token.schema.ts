import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema, Types } from 'mongoose';
import { baseSchemaOptions } from '../../common/schemas/base.schema';

export interface IRefreshToken {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export type RefreshTokenDocument = IRefreshToken & Document;

@Schema(baseSchemaOptions)
export class RefreshToken {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
  userId: Types.ObjectId;

  @Prop({ type: String, required: true, unique: true })
  token: string;

  @Prop({ type: Date, required: true })
  expiresAt: Date;
}

export const RefreshTokenSchema = SchemaFactory.createForClass(RefreshToken);

// TTL index — MongoDB will automatically delete expired tokens
RefreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
RefreshTokenSchema.index({ token: 1 }, { unique: true });
RefreshTokenSchema.index({ userId: 1 });
