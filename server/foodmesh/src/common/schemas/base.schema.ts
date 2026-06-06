import { Schema } from 'mongoose';

export const baseBusinessFields = {
  tenantId: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true,
    index: true,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  updatedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  isDeleted: {
    type: Boolean,
    default: false,
    index: true,
  },
};

export const baseSchemaOptions = {
  timestamps: true,
  versionKey: false,
};

export function applySoftDeleteMiddleware(schema: Schema): void {
  const softDeleteFilter = { isDeleted: { $ne: true } };
  schema.pre('find', function () { this.where(softDeleteFilter); });
  schema.pre('findOne', function () { this.where(softDeleteFilter); });
  schema.pre('findOneAndUpdate', function () { this.where(softDeleteFilter); });
  schema.pre('countDocuments', function () { this.where(softDeleteFilter); });
}
