const mongoose = require("mongoose");

const inventorySchema = new mongoose.Schema(
  {
    outletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Outlet",
      required: [true, "Outlet is required"],
    },
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: [true, "Menu item is required"],
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0,
    },
    threshold: {
      type: Number,
      required: [true, "Threshold is required"],
      min: [0, "Threshold cannot be negative"],
      default: 10,
    },
    isLowStock: {
      type: Boolean,
      default: false,
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

// Compound unique index: one inventory record per menu item per outlet
inventorySchema.index({ menuItemId: 1, outletId: 1 }, { unique: true });
inventorySchema.index({ menuItemId: 1 });
inventorySchema.index({ outletId: 1 });
inventorySchema.index({ tenantId: 1 });
inventorySchema.index({ quantity: 1, threshold: 1 }); // for low-stock queries
inventorySchema.index({ isDeleted: 1 });

// Auto-flag low stock before save
inventorySchema.pre("save", function (next) {
  this.isLowStock = this.quantity <= this.threshold;
  next();
});

inventorySchema.pre("findOneAndUpdate", function (next) {
  const update = this.getUpdate();
  if (update.$set && update.$set.quantity !== undefined) {
    // Cannot access threshold here directly; handled at service layer
  }
  next();
});

inventorySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

inventorySchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("Inventory", inventorySchema);
