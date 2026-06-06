const mongoose = require("mongoose");

const webhookLogSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    provider: {
      type: String,
      required: [true, "Provider is required"],
      trim: true,
      enum: {
        values: ["RAZORPAY", "STRIPE", "ZOMATO", "SWIGGY", "DUNZO", "PORTER", "CUSTOM"],
        message: "Invalid webhook provider: {VALUE}",
      },
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"],
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      required: [true, "Payload is required"],
    },
    processed: {
      type: Boolean,
      default: false,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    retryCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    errorMessage: {
      type: String,
      trim: true,
      default: null,
    },
    httpStatusCode: {
      type: Number,
      default: null,
    },
    signature: {
      type: String,
      trim: true,
      select: false,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
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

webhookLogSchema.index({ tenantId: 1 });
webhookLogSchema.index({ provider: 1, eventType: 1 });
webhookLogSchema.index({ processed: 1 });
webhookLogSchema.index({ tenantId: 1, processed: 1 });
webhookLogSchema.index({ createdAt: -1 });
// TTL: auto-delete webhook logs after 90 days
webhookLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 });
webhookLogSchema.index({ isDeleted: 1 });

webhookLogSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

webhookLogSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("WebhookLog", webhookLogSchema);
