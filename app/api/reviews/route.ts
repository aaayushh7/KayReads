import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Review from '@/models/Review';
import { requireAdmin } from '@/middleware/auth';
import slugify from 'slugify';

// GET all reviews (public)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || 'published';
    const search = searchParams.get('search') || '';
    const tag = searchParams.get('tag') || '';
    const sort = searchParams.get('sort') || 'newest';
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = parseInt(searchParams.get('offset') || '0');

    await connectDB();

    const query: any = {};

    // Filter by status
    if (status) {
      query.status = status;
    }

    // Search by title or author
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { authors: { $regex: search, $options: 'i' } },
      ];
    }

    // Filter by tag
    if (tag) {
      query.tags = tag;
    }

    // Sort options
    let sortQuery: any = {};
    switch (sort) {
      case 'oldest':
        sortQuery = { publishedAt: 1 };
        break;
      case 'rating-high':
        sortQuery = { rating: -1, publishedAt: -1 };
        break;
      case 'rating-low':
        sortQuery = { rating: 1, publishedAt: -1 };
        break;
      case 'newest':
      default:
        sortQuery = { publishedAt: -1 };
    }

    const reviews = await Review.find(query)
      .sort(sortQuery)
      .limit(limit)
      .skip(offset)
      .select('-aiDraft -bulletPoints');

    const total = await Review.countDocuments(query);

    return NextResponse.json({
      reviews,
      total,
      limit,
      offset,
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create new review (admin only)
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const data = await request.json();

    const {
      title,
      authors,
      isbn,
      publisher,
      year,
      coverUrl,
      rating,
      bulletPoints,
      aiDraft,
      finalText,
      tags,
      status,
    } = data;

    if (!title || !authors || !coverUrl || !rating || !finalText) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectDB();

    // Generate unique slug
    let slug = slugify(title, { lower: true, strict: true });
    let slugExists = await Review.findOne({ slug });
    let counter = 1;

    while (slugExists) {
      slug = `${slugify(title, { lower: true, strict: true })}-${counter}`;
      slugExists = await Review.findOne({ slug });
      counter++;
    }

    const reviewData: any = {
      slug,
      title,
      authors,
      coverUrl,
      rating,
      finalText,
      tags: tags || [],
      status: status || 'draft',
    };

    if (isbn) reviewData.isbn = isbn;
    if (publisher) reviewData.publisher = publisher;
    if (year) reviewData.year = year;
    if (bulletPoints) reviewData.bulletPoints = bulletPoints;
    if (aiDraft) reviewData.aiDraft = aiDraft;

    if (status === 'published' && !reviewData.publishedAt) {
      reviewData.publishedAt = new Date();
    }

    const review = await Review.create(reviewData);

    return NextResponse.json({
      success: true,
      review,
    });
  } catch (error: any) {
    if (error.message === 'Forbidden - Admin access required') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    console.error('Create review error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

