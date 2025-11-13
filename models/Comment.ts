import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment extends Document {
  reviewId: Types.ObjectId;
  parentId?: Types.ObjectId | null;
  text: string;
  authorName: string;
  authorEmail?: string;
  createdAt: Date;
}

const CommentSchema = new Schema<IComment>({
  reviewId: {
    type: Schema.Types.ObjectId,
    ref: 'Review',
    required: true,
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    default: null,
  },
  text: {
    type: String,
    required: true,
    trim: true,
  },
  authorName: {
    type: String,
    required: true,
    trim: true,
  },
  authorEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

CommentSchema.index({ reviewId: 1, parentId: 1 });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

