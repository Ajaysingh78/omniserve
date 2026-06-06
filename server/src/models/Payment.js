const mongoose = require("mongoose");
const { PAYMENT_STATUS } = require("./enums");

const paymentSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },
    transactionId: {
      type: String,
      required: [true, "Transaction ID is required"],
      trim: true,
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["CASH", "CARD", "UPI", "WALLET", "NET_BANKING", "COD"],
        message: "Invalid payment method: {VALUE}",
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
      min: [0, "Amount cannot be negative"],
    },
    currency: {
      type: String,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(PAYMENT_STATUS),
        message: "Invalid payment status: {VALUE}",
      },
      default: PAYMENT_STATUS.PENDING,
    },
    gatewayResponse: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    refundedAt: {
      type: Date,
      default: null,
    },
    refundTransactionId: {
      type: String,
      trim: true,
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

paymentSchema.index({ transactionId: 1 }, { unique: true });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ tenantId: 1 });
paymentSchema.index({ tenantId: 1, status: 1 });
paymentSchema.index({ createdAt: -1 });
paymentSchema.index({ isDeleted: 1 });

paymentSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

paymentSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("Payment", paymentSchema);
