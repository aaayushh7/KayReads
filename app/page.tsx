'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/ui/Navbar';
import StarRating from '@/components/ui/StarRating';
import Button from '@/components/ui/Button';
import { FaChevronLeft, FaChevronRight, FaBook } from 'react-icons/fa';

interface Review {
  _id: string;
  slug: string;
  title: string;
  authors: string[];
  coverUrl: string;
  rating: number;
  finalText: string;
  tags: string[];
  publishedAt: string;
}

export default function HomePage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await axios.get('/api/reviews?status=published&limit=10&sort=newest');
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(nextSlide, 8000); // Auto-advance every 8 seconds
      return () => clearInterval(interval);
    }
  }, [reviews]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="flex items-center justify-center h-[80vh]">
          <div className="text-center">
            <FaBook className="text-6xl text-dusty animate-pulse-soft mx-auto mb-4" />
            <p className="text-charcoal/50 text-lg">Loading reviews...</p>
          </div>
        </div>
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="bookish-container py-20 text-center">
          <FaBook className="text-6xl text-dusty mx-auto mb-6" />
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-4">
            No Reviews Yet
          </h1>
          <p className="text-charcoal/60 text-lg mb-8">
            Check back soon for heartfelt book reviews!
          </p>
        </div>
      </div>
    );
  }

  const currentReview = reviews[currentIndex];

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero Carousel */}
      <section className="relative min-h-screen pt-20 pb-16 overflow-hidden bg-gradient-to-b from-rose/10 via-cream/50 to-cream">
        <div className="bookish-container h-full">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-center max-w-7xl mx-auto">
            {/* Book Cover - Takes up 2 columns on desktop */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="relative max-w-sm mx-auto">
                {/* Decorative background */}
                <div className="absolute -inset-6 bg-gradient-to-br from-dusty/30 to-gold/30 rounded-[2rem] blur-3xl opacity-60" />
                
                {/* Cover image with better quality */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                  <img
                    src={currentReview.coverUrl}
                    alt={currentReview.title}
                    className="w-full h-auto object-cover aspect-[2/3]"
                    loading="eager"
                    style={{ 
                      imageRendering: '-webkit-optimize-contrast',
                      backfaceVisibility: 'hidden',
                      transform: 'translateZ(0)'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Review Details - Takes up 3 columns on desktop */}
            <div className="lg:col-span-3 order-1 lg:order-2 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-dusty/10 rounded-full">
                <span className="w-2 h-2 bg-dusty rounded-full animate-pulse" />
                <span className="text-sm font-medium text-dusty tracking-wide">Latest Review</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-charcoal leading-tight">
                {currentReview.title}
              </h1>

              <p className="text-lg sm:text-xl text-charcoal/70" style={{ fontFamily: 'var(--font-family-quote)', fontStyle: 'italic' }}>
                by {currentReview.authors.join(', ')}
              </p>

              <div className="py-2">
                <StarRating rating={currentReview.rating} size={28} />
              </div>

              <p className="text-base sm:text-lg text-charcoal/80 leading-relaxed line-clamp-3 sm:line-clamp-4">
                {currentReview.finalText}
              </p>

              {/* Tags */}
              {currentReview.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {currentReview.tags.slice(0, 4).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 bg-white/80 backdrop-blur-sm rounded-full text-sm text-charcoal/70 shadow-softer border border-rose/10"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="pt-4">
                <Link href={`/review/${currentReview.slug}`}>
                  <Button variant="primary" className="text-base sm:text-lg px-8 py-3.5 shadow-soft hover:shadow-lg">
                    Read Full Review
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation arrows - Better positioned */}
        {reviews.length > 1 && (
          <div className="bookish-container">
            <button
              onClick={prevSlide}
              className="absolute left-4 lg:left-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl backdrop-blur-sm border border-rose/10 z-10"
              aria-label="Previous review"
            >
              <FaChevronLeft className="text-dusty text-lg lg:text-xl" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 lg:right-8 top-1/2 -translate-y-1/2 w-12 h-12 lg:w-14 lg:h-14 bg-white/90 hover:bg-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-xl backdrop-blur-sm border border-rose/10 z-10"
              aria-label="Next review"
            >
              <FaChevronRight className="text-dusty text-lg lg:text-xl" />
            </button>
          </div>
        )}

        {/* Dot indicators - Better styled */}
        {reviews.length > 1 && (
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-2 bg-white/80 backdrop-blur-sm px-4 py-2.5 rounded-full shadow-soft border border-rose/10">
            {reviews.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === currentIndex
                    ? 'bg-dusty w-8'
                    : 'bg-dusty/30 hover:bg-dusty/50 w-2'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </section>

      {/* Recent Reviews Grid */}
      <section className="bookish-container py-16 lg:py-20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10 lg:mb-12">
          <div>
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal mb-2">
              Recent Reviews
            </h2>
            <p className="text-charcoal/60" style={{ fontStyle: 'italic' }}>
              Discover my latest book thoughts
            </p>
          </div>
          <Link href="/reviews">
            <Button variant="outline" className="shadow-soft hover:shadow-lg">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {reviews.slice(0, 8).map((review) => (
            <Link
              key={review._id}
              href={`/review/${review.slug}`}
              className="group"
            >
              <div className="card">
                <div className="aspect-[2/3] relative overflow-hidden">
                  <img
                    src={review.coverUrl}
                    alt={review.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-serif font-semibold text-lg text-charcoal mb-1 line-clamp-2">
                    {review.title}
                  </h3>
                  <p className="text-sm text-charcoal/60 mb-3 line-clamp-1">
                    {review.authors.join(', ')}
                  </p>
                  <StarRating rating={review.rating} size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-rose/30 via-dusty/20 to-gold/30 py-16 lg:py-24">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-dusty/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-rose/10 rounded-full blur-3xl" />
        
        <div className="bookish-container text-center relative z-10">
          <div className="max-w-3xl mx-auto bg-white/40 backdrop-blur-sm rounded-3xl p-8 lg:p-12 shadow-soft border border-white/60">
            <h2 className="text-3xl lg:text-4xl font-serif font-bold text-charcoal mb-4">
              Join the Reading Community
            </h2>
            <p className="text-lg lg:text-xl text-charcoal/70 mb-8 leading-relaxed" style={{ fontStyle: 'italic' }}>
              Discover honest, heartfelt reviews of the books I love (and sometimes don't).
              Let's find your next favorite read together!
            </p>
            <Link href="/reviews">
              <Button variant="secondary" className="text-base lg:text-lg px-8 py-3.5 shadow-lg hover:shadow-xl">
                Browse All Reviews
              </Button>
            </Link>
          </div>
        </div>
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
