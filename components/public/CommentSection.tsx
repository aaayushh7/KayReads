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
    <div className={`${depth > 0 ? 'ml-4 sm:ml-8 mt-3' : 'mt-4'}`}>
      <div className="flex gap-2 sm:gap-3">
        {/* Avatar - Smaller on mobile */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose flex items-center justify-center text-white font-semibold text-sm">
            {comment.authorName.charAt(0).toUpperCase()}
          </div>
        </div>

        {/* Comment content */}
        <div className="flex-1 min-w-0">
          <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-softer border border-rose/5">
            <div className="flex items-center justify-between mb-1.5 sm:mb-2">
              <span className="font-semibold text-charcoal text-sm sm:text-base truncate">
                {comment.authorName}
              </span>
              <span className="text-xs text-charcoal/50 ml-2 flex-shrink-0">{formattedDate}</span>
            </div>
            <p className="text-charcoal/80 text-sm sm:text-base whitespace-pre-wrap break-words">{comment.text}</p>
          </div>

          {/* Actions - More compact */}
          <div className="flex items-center gap-3 sm:gap-4 mt-1.5 sm:mt-2 ml-1 sm:ml-2">
            <button
              onClick={() => onReply(comment._id)}
              className="text-xs sm:text-sm text-dusty hover:text-rose flex items-center gap-1 transition-colors font-medium"
            >
              <FaReply size={11} />
              Reply
            </button>
            {hasReplies && (
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-xs sm:text-sm text-charcoal/50 hover:text-charcoal flex items-center gap-1 transition-colors"
              >
                {isCollapsed ? (
                  <>
                    <FaChevronDown size={10} />
                    <span className="hidden sm:inline">Show {comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}</span>
                    <span className="sm:hidden">{comment.replies.length}</span>
                  </>
                ) : (
                  <>
                    <FaChevronUp size={10} />
                    <span className="hidden sm:inline">Hide</span>
                    <span className="sm:hidden">−</span>
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
    <div className="mt-8 sm:mt-12">
      <h3 className="text-2xl sm:text-3xl font-serif font-bold text-charcoal mb-4 sm:mb-6">
        💬 Comments ({comments.length})
      </h3>

      {/* Comment form - More compact on mobile */}
      <div id="comment-form" className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-soft mb-6 sm:mb-8 border border-rose/5">
        {replyingTo && (
          <div className="mb-3 sm:mb-4 flex items-center justify-between bg-rose/10 px-3 sm:px-4 py-2 rounded-lg text-sm">
            <span className="text-charcoal/70">💬 Replying to comment</span>
            <button
              onClick={() => setReplyingTo(null)}
              className="text-dusty hover:text-rose font-medium"
            >
              Cancel
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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

