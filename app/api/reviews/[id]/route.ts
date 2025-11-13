import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { requireAdmin } from '@/middleware/auth';
import slugify from 'slugify';

// GET single review by ID or slug (public)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;

    let review = null;

    // Check if id is a valid MongoDB ObjectId (24 character hex string)
    const isValidObjectId = /^[0-9a-fA-F]{24}$/.test(id);

    if (isValidObjectId) {
      // Try to find by ID first
      review = await Review.findById(id);
    }

    // If not found by ID, try finding by slug
    if (!review) {
      review = await Review.findOne({ slug: id });
    }

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(review);
  } catch (error) {
    console.error('Get review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update review (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);

    const { id } = await params;
    const data = await request.json();

    await connectDB();

    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    // Update slug if title changed
    if (data.title && data.title !== review.title) {
      let slug = slugify(data.title, { lower: true, strict: true });
      let slugExists = await Review.findOne({ slug, _id: { $ne: id } });
      let counter = 1;

      while (slugExists) {
        slug = `${slugify(data.title, { lower: true, strict: true })}-${counter}`;
        slugExists = await Review.findOne({ slug, _id: { $ne: id } });
        counter++;
      }

      data.slug = slug;
    }

    // Set publishedAt if changing status to published
    if (data.status === 'published' && review.status !== 'published') {
      data.publishedAt = new Date();
    }

    const updatedReview = await Review.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true, runValidators: true }
    );

    return NextResponse.json({
      success: true,
      review: updatedReview,
    });
  } catch (error: any) {
    if (error.message === 'Forbidden - Admin access required') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    console.error('Update review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE review (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    requireAdmin(request);

    const { id } = await params;

    await connectDB();

    const review = await Review.findByIdAndDelete(id);

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'Forbidden - Admin access required') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    console.error('Delete review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

