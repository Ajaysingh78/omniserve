import mongoose, { Document, Model, Schema, Types } from "mongoose";

export interface ISimulationLog extends Document {
  tenantId: Types.ObjectId;
  sessionId: Types.ObjectId;
  jobId?: Types.ObjectId | null;
  externalOrderId?: string | null;
  eventType:
    | "SESSION_STARTED"
    | "PAYLOAD_GENERATED"
    | "ORDER_SENT"
    | "ORDER_ACCEPTED"
    | "ORDER_FAILED"
    | "OUTBOX_CREATED"
    | "SYNCJOB_CREATED"
    | "CONNECTOR_COMPLETED"
    | "SESSION_COMPLETED";
  details?: any;
  timestamp: Date;
  isSandbox: boolean;
  sandboxVersion: string;
}

const simulationLogSchema = new Schema<ISimulationLog>(
  {
    tenantId: {
      type: Schema.Types.ObjectId,
      ref: "Tenant",
      required: [true, "Tenant is required"],
    },
    sessionId: {
      type: Schema.Types.ObjectId,
      ref: "SimulationSession",
      required: [true, "SimulationSession is required"],
    },
    jobId: {
      type: Schema.Types.ObjectId,
      default: null,
    },
    externalOrderId: {
      type: String,
      default: null,
    },
    eventType: {
      type: String,
      required: [true, "Event type is required"],
      enum: [
        "SESSION_STARTED",
        "PAYLOAD_GENERATED",
        "ORDER_SENT",
        "ORDER_ACCEPTED",
        "ORDER_FAILED",
        "OUTBOX_CREATED",
        "SYNCJOB_CREATED",
        "CONNECTOR_COMPLETED",
        "SESSION_COMPLETED",
      ],
    },
    details: {
      type: Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    isSandbox: {
      type: Boolean,
      default: true,
    },
    sandboxVersion: {
      type: String,
      default: "v1",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

simulationLogSchema.index({ sessionId: 1 });
simulationLogSchema.index({ sessionId: 1, timestamp: -1 });

const SimulationLog: Model<ISimulationLog> = mongoose.model<ISimulationLog>(
  "SimulationLog",
  simulationLogSchema
);

export default SimulationLog;
