'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from 'axios';
import Button from '@/components/ui/Button';
import StarRating from '@/components/ui/StarRating';
import { FaBook, FaPlus, FaEdit, FaTrash, FaSignOutAlt, FaEye } from 'react-icons/fa';

interface Review {
  _id: string;
  slug: string;
  title: string;
  authors: string[];
  coverUrl: string;
  rating: number;
  status: string;
  publishedAt?: string;
  createdAt: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'published' | 'draft'>('all');

  useEffect(() => {
    checkAuth();
    fetchReviews();
  }, [filter]);

  const checkAuth = async () => {
    try {
      await axios.get('/api/auth/me');
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        limit: '100',
        sort: 'newest',
      });

      if (filter !== 'all') {
        params.append('status', filter);
      }

      const response = await axios.get(`/api/reviews?${params.toString()}`);
      setReviews(response.data.reviews);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/auth/logout');
      router.push('/admin/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }

    try {
      await axios.delete(`/api/reviews/${id}`);
      fetchReviews();
    } catch (error) {
      alert('Failed to delete review');
      console.error(error);
    }
  };

  const filteredReviews = reviews;

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-rose/20 sticky top-0 z-50">
        <div className="bookish-container">
          <div className="flex items-center justify-between h-16">
            <Link href="/admin/dashboard" className="flex items-center gap-2">
              <FaBook className="text-2xl text-dusty" />
              <span className="text-xl font-serif font-bold text-charcoal">
                Admin Dashboard
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <Link href="/" target="_blank">
                <Button variant="outline" className="flex items-center gap-2">
                  <FaEye />
                  View Site
                </Button>
              </Link>
              <Button
                variant="secondary"
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <FaSignOutAlt />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bookish-container py-12">
        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
              Reviews
            </h1>
            <p className="text-charcoal/60">
              Manage your book reviews
            </p>
          </div>

          <Link href="/admin/new">
            <Button variant="primary" className="flex items-center gap-2">
              <FaPlus />
              New Review
            </Button>
          </Link>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-8 border-b border-rose/20">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'all'
                ? 'text-dusty border-b-2 border-dusty'
                : 'text-charcoal/50 hover:text-charcoal'
            }`}
          >
            All ({reviews.length})
          </button>
          <button
            onClick={() => setFilter('published')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'published'
                ? 'text-dusty border-b-2 border-dusty'
                : 'text-charcoal/50 hover:text-charcoal'
            }`}
          >
            Published
          </button>
          <button
            onClick={() => setFilter('draft')}
            className={`px-6 py-3 font-medium transition-colors ${
              filter === 'draft'
                ? 'text-dusty border-b-2 border-dusty'
                : 'text-charcoal/50 hover:text-charcoal'
            }`}
          >
            Drafts
          </button>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-20">
            <FaBook className="text-6xl text-dusty animate-pulse-soft mx-auto mb-4" />
            <p className="text-charcoal/50">Loading reviews...</p>
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="text-center py-20">
            <FaBook className="text-6xl text-dusty/30 mx-auto mb-4" />
            <h2 className="text-2xl font-serif font-bold text-charcoal mb-2">
              No reviews yet
            </h2>
            <p className="text-charcoal/60 mb-6">
              Create your first book review to get started
            </p>
            <Link href="/admin/new">
              <Button variant="primary" className="flex items-center gap-2 mx-auto">
                <FaPlus />
                New Review
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <div key={review._id} className="card p-6">
                <div className="flex flex-col sm:flex-row gap-6">
                  {/* Cover */}
                  <div className="w-full sm:w-32 flex-shrink-0">
                    <img
                      src={review.coverUrl}
                      alt={review.title}
                      className="w-full rounded-lg shadow-soft"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-serif font-bold text-charcoal mb-1">
                          {review.title}
                        </h3>
                        <p className="text-charcoal/60 mb-2">
                          {review.authors.join(', ')}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          review.status === 'published'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {review.status}
                      </span>
                    </div>

                    <div className="mb-3">
                      <StarRating rating={review.rating} size={18} />
                    </div>

                    <p className="text-sm text-charcoal/50 mb-4">
                      {review.status === 'published'
                        ? `Published ${new Date(
                            review.publishedAt!
                          ).toLocaleDateString()}`
                        : `Created ${new Date(
                            review.createdAt
                          ).toLocaleDateString()}`}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      {review.status === 'published' && (
                        <Link href={`/review/${review.slug}`} target="_blank">
                          <Button variant="outline" className="text-sm">
                            <FaEye className="mr-2" />
                            View
                          </Button>
                        </Link>
                      )}
                      <Link href={`/admin/edit/${review._id}`}>
                        <Button variant="outline" className="text-sm">
                          <FaEdit className="mr-2" />
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        onClick={() => handleDelete(review._id, review.title)}
                        className="text-sm text-red-600 border-red-300 hover:bg-red-50"
                      >
                        <FaTrash className="mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

