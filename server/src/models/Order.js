const mongoose = require("mongoose");
const { ORDER_STATUS, PAYMENT_STATUS } = require("./enums");

const orderSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
      required: [true, "Outlet is required"],
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Customer is required"],
    },
    orderNumber: {
      type: String,
      trim: true,
      uppercase: true,
    },
    source: {
      type: String,
      enum: ["DINE_IN", "TAKEAWAY", "DELIVERY", "ONLINE"],
      required: [true, "Order source is required"],
    },
    subtotal: {
      type: Number,
      required: [true, "Subtotal is required"],
      min: [0, "Subtotal cannot be negative"],
    },
    tax: {
      type: Number,
      default: 0,
      min: [0, "Tax cannot be negative"],
    },
    deliveryFee: {
      type: Number,
      default: 0,
      min: [0, "Delivery fee cannot be negative"],
    },
    discount: {
      type: Number,
      default: 0,
      min: [0, "Discount cannot be negative"],
    },
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    orderStatus: {
      type: String,
      enum: {
        values: Object.values(ORDER_STATUS),
        message: "Invalid order status: {VALUE}",
      },
      default: ORDER_STATUS.PENDING,
    },
    paymentStatus: {
      type: String,
      enum: {
        values: Object.values(PAYMENT_STATUS),
        message: "Invalid payment status: {VALUE}",
      },
      default: PAYMENT_STATUS.PENDING,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    preparedAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: [255, "Cancellation reason cannot exceed 255 characters"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
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

orderSchema.index({ customerId: 1 });
orderSchema.index({ outletId: 1 });
orderSchema.index({ tenantId: 1 });
orderSchema.index({ orderStatus: 1 });
orderSchema.index({ createdAt: -1 });
orderSchema.index({ tenantId: 1, outletId: 1, orderStatus: 1 });
orderSchema.index({ tenantId: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { sparse: true });
orderSchema.index({ isDeleted: 1 });

// Auto-generate order number before save
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.orderNumber = `ORD-${timestamp}-${random}`;
  }
  next();
});

orderSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

orderSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("Order", orderSchema);
