'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/ui/Navbar';
import StarRating from '@/components/ui/StarRating';
import CommentSection from '@/components/public/CommentSection';
import Button from '@/components/ui/Button';
import LoadingAnimation from '@/components/ui/LoadingAnimation';
import { FaChevronLeft, FaChevronRight, FaBook, FaShare } from 'react-icons/fa';

interface Review {
  _id: string;
  slug: string;
  title: string;
  authors: string[];
  isbn?: string;
  publisher?: string;
  year?: number;
  coverUrl: string;
  rating: number;
  finalText: string;
  tags: string[];
  publishedAt: string;
}

export default function ReviewPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [prevReview, setPrevReview] = useState<Review | null>(null);
  const [nextReview, setNextReview] = useState<Review | null>(null);

  useEffect(() => {
    if (slug) {
      fetchReview();
      fetchNavigationReviews();
    }
  }, [slug]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/reviews/${slug}`);
      setReview(response.data);
    } catch (error) {
      console.error('Failed to fetch review:', error);
      router.push('/reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchNavigationReviews = async () => {
    try {
      const response = await axios.get('/api/reviews?status=published&limit=100&sort=newest');
      const reviews = response.data.reviews;
      const currentIndex = reviews.findIndex((r: Review) => r.slug === slug);

      if (currentIndex > 0) {
        setNextReview(reviews[currentIndex - 1]);
      }
      if (currentIndex < reviews.length - 1) {
        setPrevReview(reviews[currentIndex + 1]);
      }
    } catch (error) {
      console.error('Failed to fetch navigation reviews:', error);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    
    // Always try to copy first
    try {
      await navigator.clipboard.writeText(url);
      
      // Show toast notification
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-xl shadow-lg z-50 animate-slideIn';
      toast.textContent = '✓ Link copied to clipboard!';
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 3000);
      
      // Also try native share on mobile
      if (navigator.share && /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
        try {
          await navigator.share({
            title: review?.title,
            text: `Check out this book review: ${review?.title}`,
            url: url,
          });
        } catch (error) {
          // User cancelled or share not available - that's fine, link is already copied
          console.log('Native share not used');
        }
      }
    } catch (error) {
      // Clipboard failed
      const toast = document.createElement('div');
      toast.className = 'fixed top-20 left-1/2 -translate-x-1/2 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-xl shadow-lg z-50 animate-slideIn';
      toast.textContent = '✗ Failed to copy link. Please copy manually: ' + url;
      document.body.appendChild(toast);
      setTimeout(() => toast.remove(), 5000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[80vh]">
          <LoadingAnimation size={150} />
          <p className="text-charcoal/50 text-lg mt-6">Loading review...</p>
        </div>
      </div>
    );
  }

  if (!review) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-rose/10 to-cream py-16">
        <div className="bookish-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Book Cover */}
            <div className="lg:col-span-1">
              <div className="sticky top-24">
                <div className="relative max-w-sm mx-auto">
                  <div className="absolute -inset-4 bg-gradient-to-br from-dusty/20 to-gold/20 rounded-3xl blur-2xl" />
                  <img
                    src={review.coverUrl.replace('zoom=1', 'zoom=2')}
                    alt={review.title}
                    className="relative w-full rounded-2xl shadow-2xl"
                    loading="eager"
                    style={{ imageRendering: 'crisp-edges' }}
                  />
                  <button
                    onClick={handleShare}
                    className="mt-6 w-full btn btn-outline"
                  >
                    <FaShare className="mr-2" />
                    Share Review
                  </button>
                </div>
              </div>
            </div>

            {/* Review Content */}
            <div className="lg:col-span-2">
              <div className="mb-6">
                <Link
                  href="/reviews"
                  className="text-dusty hover:text-rose transition-colors text-sm font-medium"
                >
                  ← Back to all reviews
                </Link>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-charcoal mb-4">
                {review.title}
              </h1>

              <p className="text-xl md:text-2xl text-charcoal/70 mb-6" style={{ fontFamily: 'var(--font-family-quote)', fontStyle: 'italic' }}>
                by {review.authors.join(', ')}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 mb-6 text-sm text-charcoal/60" style={{ fontStyle: 'italic' }}>
                {review.publisher && (
                  <span>Publisher: {review.publisher}</span>
                )}
                {review.year && <span>Year: {review.year}</span>}
                {review.isbn && <span>ISBN: {review.isbn}</span>}
              </div>

              {/* Rating */}
              <div className="mb-8">
                <StarRating rating={review.rating} size={32} />
              </div>

              {/* Tags */}
              {review.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-8">
                  {review.tags.map((tag, idx) => (
                    <Link
                      key={idx}
                      href={`/reviews?tag=${encodeURIComponent(tag)}`}
                      className="px-4 py-2 bg-white rounded-full text-sm text-charcoal/70 shadow-softer hover:shadow-soft hover:-translate-y-0.5 transition-all"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              )}

              {/* Review Text */}
              <div className="bookish-prose">
                {review.finalText.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>

              {/* Published date */}
              <div className="mt-12 pt-8 border-t border-rose/20 text-sm text-charcoal/50" style={{ fontStyle: 'italic' }}>
                Published on {new Date(review.publishedAt).toLocaleDateString('en-US', {
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Navigation */}
      {(prevReview || nextReview) && (
        <section className="bookish-container py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Previous Review */}
            {prevReview ? (
              <Link
                href={`/review/${prevReview.slug}`}
                className="card p-6 flex items-center gap-4 group"
              >
                <FaChevronLeft className="text-dusty text-2xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-charcoal/60 mb-1">Previous Review</p>
                  <h3 className="font-serif font-semibold text-lg text-charcoal line-clamp-2">
                    {prevReview.title}
                  </h3>
                  <p className="text-sm text-charcoal/60 line-clamp-1">
                    {prevReview.authors.join(', ')}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {/* Next Review */}
            {nextReview ? (
              <Link
                href={`/review/${nextReview.slug}`}
                className="card p-6 flex items-center gap-4 group"
              >
                <div className="flex-1 min-w-0 text-right">
                  <p className="text-sm text-charcoal/60 mb-1">Next Review</p>
                  <h3 className="font-serif font-semibold text-lg text-charcoal line-clamp-2">
                    {nextReview.title}
                  </h3>
                  <p className="text-sm text-charcoal/60 line-clamp-1">
                    {nextReview.authors.join(', ')}
                  </p>
                </div>
                <FaChevronRight className="text-dusty text-2xl flex-shrink-0" />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </section>
      )}

      {/* Comments Section */}
      <section className="bookish-container pb-20">
        <CommentSection reviewId={review._id} />
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-12 lg:py-16">
        <div className="bookish-container text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <FaBook className="text-2xl lg:text-3xl text-dusty" />
            <span className="text-2xl lg:text-3xl font-serif font-bold">Kay Reads!</span>
          </div>
          <p className="text-white/60 mb-4 text-base lg:text-lg" style={{ fontStyle: 'italic' }}>
            A book girly's honest reviews and reading recommendations
          </p>
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} Kay Reads. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

