const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
  {
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
      required: [true, "Category name is required"],
      trim: true,
      maxlength: [100, "Category name cannot exceed 100 characters"],
    },
    displayOrder: {
      type: Number,
      default: 0,
      min: [0, "Display order cannot be negative"],
    },
    isActive: {
      type: Boolean,
      default: true,
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

categorySchema.index({ tenantId: 1 });
categorySchema.index({ outletId: 1 });
categorySchema.index({ outletId: 1, displayOrder: 1 });
categorySchema.index({ tenantId: 1, outletId: 1 });
categorySchema.index({ isDeleted: 1 });

categorySchema.pre("find", function () {
  this.where({ isDeleted: false });
});

categorySchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("Category", categorySchema);
