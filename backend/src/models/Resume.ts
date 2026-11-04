import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IResume extends Document {
  candidateId: Types.ObjectId;
  fileName: string;
  fileType: string;
  fileSize: number;
  storageKey: string;
  uploadedAt: Date;
}

const resumeSchema = new Schema<IResume>(
  {
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    fileType: {
      type: String,
      required: true,
      enum: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
    },
    fileSize: {
      type: Number,
      required: true,
      max: [10 * 1024 * 1024, 'Resume file size cannot exceed 10MB'],
    },
    storageKey: {
      type: String,
      required: true,
      unique: true,
    },
    uploadedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

resumeSchema.index({ candidateId: 1, uploadedAt: -1 });

export const Resume = mongoose.model<IResume>('Resume', resumeSchema);

