const mongoose = require("mongoose");
const { SUBSCRIPTION_PLANS, USER_STATUS } = require("./enums");

const tenantSchema = new mongoose.Schema( //it help to seperate other and donot see anyone data whtih the help of tenateid
  {
    name: {
      type: String,
      required: [true, "Tenant name is required"],
      trim: true,
      maxlength: [100, "Tenant name cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      required: [true, "Slug is required"],
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"],
      maxlength: [100, "Slug cannot exceed 100 characters"],
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Owner is required"],
    },
    subscriptionPlan: {
      type: String,
      enum: {
        values: Object.values(SUBSCRIPTION_PLANS),
        message: "Invalid subscription plan: {VALUE}",
      },
      default: SUBSCRIPTION_PLANS.FREE,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(USER_STATUS),
        message: "Invalid tenant status: {VALUE}",
      },
      default: USER_STATUS.ACTIVE,
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

tenantSchema.index({ slug: 1 }, { unique: true });
tenantSchema.index({ ownerId: 1 });
tenantSchema.index({ status: 1 });
tenantSchema.index({ isDeleted: 1 });

tenantSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

tenantSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("Tenant", tenantSchema);
