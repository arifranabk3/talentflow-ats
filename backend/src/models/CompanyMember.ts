import mongoose, { Schema, Document, Types } from 'mongoose';

export interface ICompanyMember extends Document {
  companyId: Types.ObjectId;
  userId: Types.ObjectId;
  role: 'owner' | 'recruiter' | 'hiring_manager';
  status: 'active' | 'invited' | 'revoked';
  createdAt: Date;
  updatedAt: Date;
}

const companyMemberSchema = new Schema<ICompanyMember>(
  {
    companyId: {
      type: Schema.Types.ObjectId,
      ref: 'Company',
      required: true,
      index: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      enum: ['owner', 'recruiter', 'hiring_manager'],
      default: 'recruiter',
    },
    status: {
      type: String,
      enum: ['active', 'invited', 'revoked'],
      default: 'active',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Unique compound index: a user can only have one membership per company
companyMemberSchema.index({ companyId: 1, userId: 1 }, { unique: true });
companyMemberSchema.index({ userId: 1, status: 1 });

export const CompanyMember = mongoose.model<ICompanyMember>('CompanyMember', companyMemberSchema);

