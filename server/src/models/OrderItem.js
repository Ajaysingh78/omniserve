const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, "Order is required"],
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: [true, "Menu item is required"],
    },
    variantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variant",
      default: null,
    },
    addons: [
      {
        addonId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Addon",
        },
        name: String,
        price: Number,
      },
    ],
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true,
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity must be at least 1"],
    },
    unitPrice: {
      type: Number,
      required: [true, "Unit price is required"],
      min: [0, "Unit price cannot be negative"],
    },
    totalPrice: {
      type: Number,
      required: [true, "Total price is required"],
      min: [0, "Total price cannot be negative"],
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [255, "Notes cannot exceed 255 characters"],
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

orderItemSchema.index({ orderId: 1 });
orderItemSchema.index({ menuItemId: 1 });
orderItemSchema.index({ tenantId: 1 });
orderItemSchema.index({ isDeleted: 1 });

// Auto-calculate totalPrice
orderItemSchema.pre("save", function (next) {
  this.totalPrice = this.quantity * this.unitPrice;
  next();
});

orderItemSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

orderItemSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("OrderItem", orderItemSchema);
