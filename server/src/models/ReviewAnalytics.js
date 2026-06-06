const mongoose = require("mongoose");

const reviewAnalyticsSchema = new mongoose.Schema(
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
    source: {
      type: String,
      required: [true, "Review source is required"],
      trim: true,
      enum: {
        values: ["GOOGLE", "ZOMATO", "SWIGGY", "INTERNAL", "FACEBOOK", "TRIPADVISOR", "OTHER"],
        message: "Invalid review source: {VALUE}",
      },
    },
    reviewText: {
      type: String,
      trim: true,
      maxlength: [2000, "Review text cannot exceed 2000 characters"],
    },
    sentimentScore: {
      type: Number,
      min: [-1, "Sentiment score minimum is -1"],
      max: [1, "Sentiment score maximum is 1"],
      default: 0,
    },
    sentimentLabel: {
      type: String,
      enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"],
      default: "NEUTRAL",
    },
    rating: {
      type: Number,
      min: [1, "Rating minimum is 1"],
      max: [5, "Rating maximum is 5"],
      default: null,
    },
    reviewDate: {
      type: Date,
      default: Date.now,
    },
    externalReviewId: {
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

reviewAnalyticsSchema.index({ tenantId: 1 });
reviewAnalyticsSchema.index({ outletId: 1 });
reviewAnalyticsSchema.index({ outletId: 1, source: 1 });
reviewAnalyticsSchema.index({ outletId: 1, sentimentLabel: 1 });
reviewAnalyticsSchema.index({ reviewDate: -1 });
reviewAnalyticsSchema.index({ isDeleted: 1 });

// Auto-compute sentiment label from score
reviewAnalyticsSchema.pre("save", function (next) {
  if (this.sentimentScore > 0.1) {
    this.sentimentLabel = "POSITIVE";
  } else if (this.sentimentScore < -0.1) {
    this.sentimentLabel = "NEGATIVE";
  } else {
    this.sentimentLabel = "NEUTRAL";
  }
  next();
});

reviewAnalyticsSchema.pre("find", function () {
  this.where({ isDeleted: false });
});

reviewAnalyticsSchema.pre("findOne", function () {
  this.where({ isDeleted: false });
});

module.exports = mongoose.model("ReviewAnalytics", reviewAnalyticsSchema);
