import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  slug: string;
  title: string;
  authors: string[];
  isbn?: string;
  publisher?: string;
  year?: number;
  coverUrl: string;
  rating: number;
  bulletPoints?: string[];
  aiDraft?: string;
  finalText: string;
  tags: string[];
  createdAt: Date;
  publishedAt?: Date;
  status: 'draft' | 'published';
}

const ReviewSchema = new Schema<IReview>({
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  authors: [{
    type: String,
    trim: true,
  }],
  isbn: {
    type: String,
    trim: true,
  },
  publisher: {
    type: String,
    trim: true,
  },
  year: {
    type: Number,
  },
  coverUrl: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  bulletPoints: [{
    type: String,
  }],
  aiDraft: {
    type: String,
  },
  finalText: {
    type: String,
    required: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  publishedAt: {
    type: Date,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
});

export default mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);

