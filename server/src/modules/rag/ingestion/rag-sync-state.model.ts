import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRAGSyncState extends Document {
  serviceName: string;
  lastSyncedAt: Date;
  status: string;
  recordsSynced: number;
}

const ragSyncStateSchema = new Schema<IRAGSyncState>(
  {
    serviceName: {
      type: String,
      required: true,
      unique: true,
    },
    lastSyncedAt: {
      type: Date,
      required: true,
      default: () => new Date(0), // Default to epoch if never synced
    },
    status: {
      type: String,
      default: 'IDLE',
    },
    recordsSynced: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const RAGSyncState: Model<IRAGSyncState> = mongoose.model<IRAGSyncState>('RAGSyncState', ragSyncStateSchema);
export default RAGSyncState;
