import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IJob extends Document {
  companyId: Types.ObjectId;
  createdBy: Types.ObjectId;
  title: string;
  slug: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  location: string;
  employmentType: 'full-time' | 'part-time' | 'contract' | 'internship';
  workplaceType: 'remote' | 'hybrid' | 'on-site';
  salaryRange?: {
    min: number;
    max: number;
    currency: string;
  };
  skills: string[];
  status: 'draft' | 'published' | 'paused' | 'closed' | 'rejected';
  applicationDeadline?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJob>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: 180,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    requirements: {
      type: [String],
      default: [],
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['full-time', 'part-time', 'contract', 'internship'],
      default: 'full-time',
    },
    workplaceType: {
      type: String,
      enum: ['remote', 'hybrid', 'on-site'],
      default: 'remote',
    },
    salaryRange: {
      min: { type: Number },
      max: { type: Number },
      currency: { type: String, default: 'USD' },
    },
    skills: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'paused', 'closed', 'rejected'],
      default: 'draft',
      index: true,
    },
    applicationDeadline: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for job search, company listings, and pipeline queries
jobSchema.index({ companyId: 1, status: 1 });
jobSchema.index({ status: 1, createdAt: -1 });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ companyId: 1, slug: 1 }, { unique: true });

export const Job = mongoose.model<IJob>('Job', jobSchema);

