import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICandidateProfile extends Document {
  userId: Types.ObjectId;
  headline?: string;
  summary?: string;
  phone?: string;
  location?: string;
  skills: string[];
  experience: Array<{
    title: string;
    company: string;
    startDate: Date;
    endDate?: Date;
    current: boolean;
    description?: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    fieldOfStudy?: string;
    graduationYear?: number;
  }>;
  portfolioUrl?: string;
  linkedinUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const candidateProfileSchema = new Schema<ICandidateProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    headline: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    summary: {
      type: String,
      maxlength: 3000,
    },
    phone: {
      type: String,
      trim: true,
    },
    location: {
      type: String,
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    experience: [
      {
        title: { type: String, required: true },
        company: { type: String, required: true },
        startDate: { type: Date, required: true },
        endDate: { type: Date },
        current: { type: Boolean, default: false },
        description: { type: String },
      },
    ],
    education: [
      {
        institution: { type: String, required: true },
        degree: { type: String, required: true },
        fieldOfStudy: { type: String },
        graduationYear: { type: Number },
      },
    ],
    portfolioUrl: {
      type: String,
      trim: true,
    },
    linkedinUrl: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
candidateProfileSchema.index({ skills: 1 });

export const CandidateProfile = mongoose.model<ICandidateProfile>('CandidateProfile', candidateProfileSchema);
