'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import { FaReply, FaChevronDown, FaChevronUp } from 'react-icons/fa';

interface Comment {
  _id: string;
  reviewId: string;
  parentId?: string | null;
  text: string;
  authorName: string;
  createdAt: string;
  replies: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onReply: (parentId: string) => void;
  depth?: number;
}

function CommentItem({ comment, onReply, depth = 0 }: CommentItemProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const hasReplies = comment.replies && comment.replies.length > 0;

  const formattedDate = new Date(comment.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mt-6'}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-rose flex items-center justify-center text-white font-semibold">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Comment content */}
        <div className="flex-1">
          <div className="bg-white rounded-xl p-4 shadow-softer">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-charcoal">
                {comment.authorName}
              </span>
              <span className="text-xs text-charcoal/50">{formattedDate}</span>
            </div>
            <p className="text-charcoal/80 whitespace-pre-wrap">{comment.text}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4 mt-2 ml-2">
            <button
              onClick={() => onReply(comment._id)}
              className="text-sm text-dusty hover:text-rose flex items-center gap-1 transition-colors"
            >
              <FaReply size={12} />
              Reply
            </button>
            {hasReplies && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-sm text-charcoal/50 hover:text-charcoal flex items-center gap-1 transition-colors"
              >
                {isCollapsed ? (
                  <>
                    <FaChevronDown size={12} />
                    Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
                  </>
                ) : (
                  <>
                    <FaChevronUp size={12} />
                    Hide replies
                  </>
                )}
              </button>
            )}
          </div>

          {/* Nested replies */}
          {hasReplies && !isCollapsed && (
            <div className="mt-2">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onReply={onReply}
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface CommentSectionProps {
  reviewId: string;
}

export default function CommentSection({ reviewId }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    text: '',
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    fetchComments();
  }, [reviewId]);

  const fetchComments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/comments?reviewId=${reviewId}`);
      setComments(response.data.comments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    if (!formData.authorName.trim()) {
      setErrors({ authorName: 'Name is required' });
      return;
    }

    if (!formData.text.trim()) {
      setErrors({ text: 'Comment is required' });
      return;
    }

    try {
      setSubmitting(true);
      await axios.post('/api/comments', {
        reviewId,
        parentId: replyingTo,
        ...formData,
      });

      // Reset form
      setFormData({ authorName: '', authorEmail: '', text: '' });
      setReplyingTo(null);

      // Refresh comments
      fetchComments();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to post comment';
      setErrors({ submit: errorMessage });
    } finally {
      setSubmitting(false);
    }
  };

  const handleReply = (parentId: string) => {
    setReplyingTo(parentId);
    // Scroll to form
    document.getElementById('comment-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="mt-12">
      <h3 className="text-3xl font-serif font-bold text-charcoal mb-6">
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      <div id="comment-form" className="bg-white rounded-2xl p-6 shadow-soft mb-8">
        {replyingTo && (
          <div className="mb-4 flex items-center justify-between bg-rose/10 px-4 py-2 rounded-lg">
            <span className="text-sm text-charcoal/70">Replying to comment</span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-sm text-dusty hover:text-rose"
            >
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Name"
              placeholder="Your name"
              value={formData.authorName}
              onChange={(e) =>
                setFormData({ ...formData, authorName: e.target.value })
              }
              error={errors.authorName}
              required
            />
            <Input
              label="Email (optional)"
              type="email"
              placeholder="your@email.com"
              value={formData.authorEmail}
              onChange={(e) =>
                setFormData({ ...formData, authorEmail: e.target.value })
              }
            />
          </div>

          <Textarea
            label="Comment"
            placeholder="Share your thoughts..."
            rows={4}
            value={formData.text}
            onChange={(e) =>
              setFormData({ ...formData, text: e.target.value })
            }
            error={errors.text}
            required
          />

          {errors.submit && (
            <p className="text-sm text-red-500">{errors.submit}</p>
          )}

          <Button type="submit" isLoading={submitting}>
            Post Comment
          </Button>
        </form>
      </div>

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-pulse-soft text-charcoal/50">
            Loading comments...
          </div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 text-charcoal/50">
          <p>No comments yet. Be the first to share your thoughts!</p>
        </div>
      ) : (
        <div>
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onReply={handleReply}
            />
          ))}
        </div>
      )}
    </div>
  );
}

