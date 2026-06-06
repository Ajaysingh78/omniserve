const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
    },
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
      required: [true, "Outlet is required"],
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    name: {
      type: String,
      required: [true, "Menu item name is required"],
      trim: true,
      maxlength: [150, "Name cannot exceed 150 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot exceed 500 characters"],
    },
    image: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      maxlength: [50, "SKU cannot exceed 50 characters"],
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    isVeg: {
      type: Boolean,
      default: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    displayOrder: {
      type: Number,
      default: 0,
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

menuItemSchema.index({ name: "text", description: "text" });
menuItemSchema.index({ categoryId: 1 });
menuItemSchema.index({ outletId: 1 });
menuItemSchema.index({ tenantId: 1 });
menuItemSchema.index({ outletId: 1, isAvailable: 1 });
menuItemSchema.index({ outletId: 1, categoryId: 1 });
menuItemSchema.index({ tenantId: 1, isDeleted: 1 });
menuItemSchema.index({ sku: 1, outletId: 1 }, { sparse: true });

menuItemSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

menuItemSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("MenuItem", menuItemSchema);
