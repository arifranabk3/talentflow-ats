import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IInterview extends Document {
  applicationId: Types.ObjectId;
  candidateId: Types.ObjectId;
  recruiterId: Types.ObjectId;
  scheduledAt: Date;
  duration: number; // minutes
  interviewType: 'screening' | 'technical' | 'cultural' | 'executive';
  meetingLink?: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'rescheduled';
  feedback?: {
    score?: number;
    notes?: string;
    submittedAt?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>(
  {
    applicationId: {
      type: Schema.Types.ObjectId,
      ref: 'Application',
      required: true,
      index: true,
    },
    candidateId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    recruiterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    duration: {
      type: Number,
      default: 45, // 45 minutes default
    },
    interviewType: {
      type: String,
      enum: ['screening', 'technical', 'cultural', 'executive'],
      default: 'technical',
    },
    meetingLink: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled',
      index: true,
    },
    feedback: {
      score: { type: Number, min: 1, max: 100 },
      notes: { type: String, maxlength: 5000 },
      submittedAt: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
interviewSchema.index({ recruiterId: 1, scheduledAt: 1 });
interviewSchema.index({ candidateId: 1, scheduledAt: 1 });

export const Interview = mongoose.model<IInterview>('Interview', interviewSchema);

