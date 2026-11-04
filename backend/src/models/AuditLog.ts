import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IAuditLog extends Document {
  actorId?: Types.ObjectId;
  action: string;
  resourceType: string;
  resourceId?: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  createdAt: Date;
}

const auditLogSchema = new Schema<IAuditLog>(
  {
    actorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      index: true,
    },
    action: {
      type: String,
      required: true,
      index: true,
    },
    resourceType: {
      type: String,
      required: true,
      index: true,
    },
    resourceId: {
      type: String,
    },
    metadata: {
      type: Schema.Types.Mixed,
    },
    ipAddress: {
      type: String,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      immutable: true, // immutable at schema level
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // append-only: no updatedAt
  }
);

// Prevent updates and deletions at Mongoose middleware level to enforce append-only security journal
auditLogSchema.pre('updateOne', function () {
  throw new Error('Audit records are immutable and cannot be updated.');
});
auditLogSchema.pre('updateMany', function () {
  throw new Error('Audit records are immutable and cannot be updated.');
});
auditLogSchema.pre('findOneAndDelete', function () {
  throw new Error('Audit records are immutable and cannot be deleted.');
});
auditLogSchema.pre('deleteOne', function () {
  throw new Error('Audit records are immutable and cannot be deleted.');
});
auditLogSchema.pre('deleteMany', function () {
  throw new Error('Audit records are immutable and cannot be deleted.');
});

// Indexes for security audit inspection
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ resourceType: 1, resourceId: 1 });

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', auditLogSchema);

