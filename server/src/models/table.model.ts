import mongoose, { Document, Model, Schema, Types } from 'mongoose';
import crypto from 'crypto';

export interface ITable extends Document {
  tenantId: Types.ObjectId;
  outletId: Types.ObjectId;
  diningAreaId?: Types.ObjectId | null;
  tableNumber: string;
  seatCount: number;
  qrToken: string;
  status: 'ACTIVE' | 'INACTIVE';
  metadata?: {
    floor?: string;
    notes?: string;
  };
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const tableSchema = new Schema<ITable>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: [true, 'Tenant is required'],
    },
    outletId: {
      type: Schema.Types.ObjectId,
      ref: 'Outlet',
      required: [true, 'Outlet is required'],
    },
    diningAreaId: {
      type: Schema.Types.ObjectId,
      ref: 'DiningArea',
      default: null,
    },
    tableNumber: {
      type: String,
      required: [true, 'Table number is required'],
      trim: true,
    },
    seatCount: {
      type: Number,
      required: [true, 'Seat count is required'],
      min: [1, 'Seat count must be at least 1'],
    },
    qrToken: {
      type: String,
      unique: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: ['ACTIVE', 'INACTIVE'],
        message: 'Invalid table status: {VALUE}',
      },
      default: 'ACTIVE',
    },
    metadata: {
      floor: { type: String, trim: true },
      notes: { type: String, trim: true },
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

tableSchema.index({ tenantId: 1 });
tableSchema.index({ outletId: 1 });
tableSchema.index({ qrToken: 1 }, { unique: true });
tableSchema.index({ tenantId: 1, outletId: 1, tableNumber: 1 });
tableSchema.index({ isDeleted: 1 });

// Generate unique qrToken pre-save if not provided
tableSchema.pre('save', function (this: ITable, next) {
  if (!this.qrToken) {
    this.qrToken = crypto.randomBytes(16).toString('hex');
  }
  next();
});

tableSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

tableSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

const Table: Model<ITable> = mongoose.model<ITable>('Table', tableSchema);
export default Table;
