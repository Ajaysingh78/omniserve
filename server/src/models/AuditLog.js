const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required"],
    },
    action: {
      type: String,
      required: [true, "Action is required"],
      trim: true,
      enum: {
        values: [
          "CREATE",
          "UPDATE",
          "DELETE",
          "RESTORE",
          "LOGIN",
          "LOGOUT",
          "EXPORT",
          "IMPORT",
          "STATUS_CHANGE",
        ],
        message: "Invalid action: {VALUE}",
      },
    },
    entityType: {
      type: String,
      required: [true, "Entity type is required"],
      trim: true,
    },
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "Entity ID is required"],
    },
    oldData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    newData: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
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

// Audit logs are append-only; no updatedBy/createdBy needed beyond userId
auditLogSchema.index({ tenantId: 1 });
auditLogSchema.index({ userId: 1 });
auditLogSchema.index({ entityType: 1, entityId: 1 });
auditLogSchema.index({ tenantId: 1, createdAt: -1 });
auditLogSchema.index({ action: 1 });
// TTL: auto-delete audit logs after 365 days (adjust as needed)
auditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 31536000 });

module.exports = mongoose.model("AuditLog", auditLogSchema);
