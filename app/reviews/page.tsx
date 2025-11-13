'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import Navbar from '@/components/ui/Navbar';
import StarRating from '@/components/ui/StarRating';
import Input from '@/components/ui/Input';
import { FaSearch, FaBook } from 'react-icons/fa';

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

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);

  useEffect(() => {
    fetchReviews();
  }, [search, sort, selectedTag]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: 'published',
        sort,
        limit: '100',
      });

      if (search) params.append('search', search);
      if (selectedTag) params.append('tag', selectedTag);

      const response = await axios.get(`/api/reviews?${params.toString()}`);
      setReviews(response.data.reviews);

      // Extract unique tags
      const tags = new Set<string>();
      response.data.reviews.forEach((review: Review) => {
        review.tags.forEach((tag) => tags.add(tag));
      });
      setAllTags(Array.from(tags).sort());
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-to-b from-rose/10 to-cream py-16">
        <div className="bookish-container">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-charcoal mb-4">
            All Reviews
          </h1>
          <p className="text-xl text-charcoal/70 max-w-2xl">
            Browse through all my honest, heartfelt book reviews. Find your next great read!
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bookish-container py-8 sticky top-16 bg-cream/95 backdrop-blur-sm z-40 border-b border-rose/10">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          {/* Search */}
          <div className="w-full md:w-96 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-charcoal/40 pointer-events-none z-10" />
            <Input
              type="text"
              placeholder="Search by title or author..."
              value={search}
              onChange={handleSearchChange}
              className="pl-11"
            />
          </div>

          {/* Sort */}
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="input w-full md:w-auto"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="rating-high">Highest Rated</option>
            <option value="rating-low">Lowest Rated</option>
          </select>

          {/* Tag filter */}
          {allTags.length > 0 && (
            <select
              value={selectedTag}
              onChange={(e) => setSelectedTag(e.target.value)}
              className="input w-full md:w-auto"
            >
              <option value="">All Genres</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>
                  {tag}
                </option>
              ))}
            </select>
          )}

          {/* Results count */}
          <div className="text-sm text-charcoal/60 ml-auto whitespace-nowrap">
            {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="bookish-container py-12">
        {loading ? (
          <div className="text-center py-20">
            <FaBook className="text-6xl text-dusty animate-pulse-soft mx-auto mb-4" />
            <p className="text-charcoal/50 text-lg">Loading reviews...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <FaBook className="text-6xl text-dusty/30 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
              No reviews found
            </h2>
            <p className="text-charcoal/60">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {reviews.map((review) => (
              <Link
                key={review._id}
                href={`/review/${review.slug}`}
                className="group"
              >
                <div className="card h-full">
                  <div className="aspect-[2/3] relative overflow-hidden">
                    <img
                      src={review.coverUrl}
                      alt={review.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-serif font-semibold text-lg text-charcoal mb-1 line-clamp-2">
                      {review.title}
                    </h3>
                    <p className="text-sm text-charcoal/60 mb-3 line-clamp-1">
                      {review.authors.join(', ')}
                    </p>
                    <div className="mb-3">
                      <StarRating rating={review.rating} size={16} />
                    </div>
                    <p className="text-sm text-charcoal/70 line-clamp-3 mb-3 flex-1">
                      {review.finalText}
                    </p>
                    {review.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {review.tags.slice(0, 2).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-rose/10 rounded-full text-xs text-charcoal/60"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-white py-12 lg:py-16 mt-20">
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

