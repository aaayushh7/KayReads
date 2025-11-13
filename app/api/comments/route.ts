import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Comment from '@/models/Comment';
import Review from '@/models/Review';

// GET comments for a review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const reviewId = searchParams.get('reviewId');

    if (!reviewId) {
      return NextResponse.json(
        { error: 'Review ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Get all comments for this review
    const comments = await Comment.find({ reviewId })
      .sort({ createdAt: -1 });

    // Build nested comment tree
    const commentMap = new Map();
    const rootComments: any[] = [];

    // First pass: create map of all comments
    comments.forEach((comment) => {
      commentMap.set(comment._id.toString(), {
        ...comment.toObject(),
        replies: [],
      });
    });

    // Second pass: build tree structure
    comments.forEach((comment) => {
      const commentObj = commentMap.get(comment._id.toString());
      
      if (comment.parentId) {
        const parent = commentMap.get(comment.parentId.toString());
        if (parent) {
          parent.replies.push(commentObj);
        } else {
          // Parent not found, treat as root
          rootComments.push(commentObj);
        }
      } else {
        rootComments.push(commentObj);
      }
    });

    return NextResponse.json({
      comments: rootComments,
      total: comments.length,
    });
  } catch (error) {
    console.error('Get comments error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new comment
export async function POST(request: NextRequest) {
  try {
    const { reviewId, parentId, text, authorName, authorEmail } = await request.json();

    if (!reviewId || !text || !authorName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Basic validation
    if (text.length < 2 || text.length > 2000) {
      return NextResponse.json(
        { error: 'Comment must be between 2 and 2000 characters' },
        { status: 400 }
      );
    }

    if (authorName.length < 2 || authorName.length > 50) {
      return NextResponse.json(
        { error: 'Name must be between 2 and 50 characters' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify review exists
    const review = await Review.findById(reviewId);
    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // If parentId is provided, verify parent comment exists
    if (parentId) {
      const parentComment = await Comment.findById(parentId);
      if (!parentComment) {
        return NextResponse.json(
          { error: 'Parent comment not found' },
          { status: 404 }
        );
      }
    }

    // Rate limiting: check if same user posted recently (simple approach)
    // In production, use Redis or more sophisticated rate limiting
    const recentComment = await Comment.findOne({
      authorEmail: authorEmail || authorName,
      createdAt: { $gte: new Date(Date.now() - 30000) }, // 30 seconds
    });

    if (recentComment) {
      return NextResponse.json(
        { error: 'Please wait before posting another comment' },
        { status: 429 }
      );
    }

    const comment = await Comment.create({
      reviewId,
      parentId: parentId || null,
      text,
      authorName,
      authorEmail,
    });

    return NextResponse.json({
      success: true,
      comment,
    });
  } catch (error) {
    console.error('Create comment error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

