import mongoose, { Document, Model, Schema, Types } from 'mongoose';

export interface IBillSession extends Document {
  tenantId: Types.ObjectId;
  outletId: Types.ObjectId;
  tableId: Types.ObjectId;
  sessionId: Types.ObjectId;
  orderIds: Types.ObjectId[];
  totalAmount: number;
  status: 'OPEN' | 'SETTLED';
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const billSessionSchema = new Schema<IBillSession>(
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
    tableId: {
      type: Schema.Types.ObjectId,
      ref: 'Table',
      required: [true, 'Table is required'],
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: 'QRSession',
      required: [true, 'QR Session is required'],
    },
    orderIds: {
      type: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
      default: [],
    },
    totalAmount: {
      type: Number,
      required: [true, 'Total amount is required'],
      min: [0, 'Total amount cannot be negative'],
      default: 0,
    },
    status: {
      type: String,
      enum: {
        values: ['OPEN', 'SETTLED'],
        message: 'Invalid bill status: {VALUE}',
      },
      default: 'OPEN',
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

billSessionSchema.index({ tenantId: 1 });
billSessionSchema.index({ outletId: 1 });
billSessionSchema.index({ sessionId: 1 });
billSessionSchema.index({ tableId: 1, sessionId: 1 });
billSessionSchema.index({ isDeleted: 1 });

billSessionSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

billSessionSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

const BillSession: Model<IBillSession> = mongoose.model<IBillSession>('BillSession', billSessionSchema);
export default BillSession;
