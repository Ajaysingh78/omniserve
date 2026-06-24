import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface IIntegrationEventQueue extends Document {
  tenantId: Types.ObjectId;
  outletId: Types.ObjectId | null;
  eventType: string;
  aggregateType: string;
  aggregateId: Types.ObjectId;
  payload: unknown;
  status: string;
  correlationId: string;
  causationId: string | null;
  eventVersion: number;
  schemaVersion: number;
  createdBy: Types.ObjectId | null;
  sourceSystem: string;
  queuedAt: Date;
  startedAt: Date | null;
  processedAt: Date | null;
  processingNodeId: string | null;
  processingStartedAt: Date | null;
  retryCount: number;
  maxRetryCount: number;
  nextRetryAt: Date | null;
  failureReason: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const integrationEventQueueSchema = new Schema<IIntegrationEventQueue>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    outletId: {
      type: Schema.Types.ObjectId,
      ref: "Outlet",
      default: null,
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"],
      enum: ["ORDER_CREATED", "ORDER_STATUS_CHANGED", "MENU_CHANGED", "INVENTORY_CHANGED", "CART_CREATED", "CART_UPDATED", "CHECKOUT_STARTED"],
      trim: true,
    },
    aggregateType: {
      type: String,
      required: [true, "Aggregate type is required"],
      enum: ["ORDER", "MENU_ITEM", "INVENTORY", "CART"],
      trim: true,
    },
    aggregateId: {
      type: Schema.Types.ObjectId,
      required: [true, "Aggregate ID is required"],
    },
    payload: {
      type: Schema.Types.Mixed,
      required: [true, "Payload is required"],
    },
    status: {
      type: String,
      required: [true, "Status is required"],
      enum: ["PENDING", "PROCESSING", "SUCCESS", "FAILED", "DLQ"],
      default: "PENDING",
    },
    correlationId: {
      type: String,
      required: [true, "Correlation ID is required"],
      trim: true,
    },
    causationId: {
      type: String,
      default: null,
      trim: true,
    },
    eventVersion: {
      type: Number,
      default: 1,
    },
    schemaVersion: {
      type: Number,
      default: 1,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sourceSystem: {
      type: String,
      required: [true, "Source system is required"],
      enum: ["QR", "SWIGGY", "ZOMATO", "WEBSITE", "POS", "SYSTEM", "QR_DINE_IN", "DINE_IN", "TAKEAWAY", "DELIVERY", "ONLINE", "ONDC", "WHATSAPP", "WAITER"],
      trim: true,
    },
    queuedAt: {
      type: Date,
      default: Date.now,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    processingNodeId: {
      type: String,
      default: null,
    },
    processingStartedAt: {
      type: Date,
      default: null,
    },
    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    maxRetryCount: {
      type: Number,
      default: 3,
      min: 0,
    },
    nextRetryAt: {
      type: Date,
      default: null,
    },
    failureReason: {
      type: String,
      default: null,
      trim: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Indexes
integrationEventQueueSchema.index({ tenantId: 1, status: 1 });
integrationEventQueueSchema.index({ eventType: 1, status: 1 });
integrationEventQueueSchema.index({ nextRetryAt: 1, status: 1 });
integrationEventQueueSchema.index({ correlationId: 1 });
integrationEventQueueSchema.index({ status: 1, processingStartedAt: 1 }); // For recovery poller safety

// Event Deduplication unique compound index
integrationEventQueueSchema.index(
  { tenantId: 1, eventType: 1, aggregateId: 1, correlationId: 1, eventVersion: 1 },
  { unique: true }
);

const IntegrationEventQueue: Model<IIntegrationEventQueue> =
  mongoose.model<IIntegrationEventQueue>("IntegrationEventQueue", integrationEventQueueSchema);

export default IntegrationEventQueue;
