import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IApplication extends Document {
  jobId: Types.ObjectId;
  candidateId: Types.ObjectId;
  companyId: Types.ObjectId;
  resumeId?: Types.ObjectId;
  coverLetter?: string;
  status: 'applied' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';
  recruiterNotes?: string;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    jobId: {
      type: Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    resumeId: {
      type: Schema.Types.ObjectId,
      ref: 'Resume',
    },
    coverLetter: {
      type: String,
      maxlength: 5000,
    },
    status: {
      type: String,
      enum: ['applied', 'screening', 'interview', 'offered', 'hired', 'rejected'],
      default: 'applied',
      index: true,
    },
    recruiterNotes: {
      type: String,
      maxlength: 5000,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications: exactly one application per candidate per job
applicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

// Pipeline queries: find applications for a specific company or job in a specific stage
applicationSchema.index({ companyId: 1, status: 1 });
applicationSchema.index({ jobId: 1, status: 1, appliedAt: -1 });
applicationSchema.index({ candidateId: 1, appliedAt: -1 });

export const Application = mongoose.model<IApplication>('Application', applicationSchema);

