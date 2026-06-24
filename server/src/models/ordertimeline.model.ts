import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IOrderTimeline extends Document {
  tenantId: Types.ObjectId;
  orderId: Types.ObjectId;
  status: string;
  timestamp: Date;
  sourceSystem: string;
  notes?: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const orderTimelineSchema = new Schema<IOrderTimeline>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      trim: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    sourceSystem: {
      type: String,
      required: [true, "Source system is required"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
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

// Indexes
orderTimelineSchema.index({ tenantId: 1 });
orderTimelineSchema.index({ orderId: 1, timestamp: 1 });
orderTimelineSchema.index({ isDeleted: 1 });

orderTimelineSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

orderTimelineSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

const OrderTimeline: Model<IOrderTimeline> = mongoose.model<IOrderTimeline>(
  "OrderTimeline",
  orderTimelineSchema
);

export default OrderTimeline;
