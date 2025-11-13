'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import StarRating from '@/components/ui/StarRating';
import BarcodeScanner from '@/components/admin/BarcodeScanner';
import { FaBook, FaCamera, FaMagic, FaArrowLeft } from 'react-icons/fa';
import Link from 'next/link';

interface BookData {
  title: string;
  authors: string[];
  isbn?: string;
  publisher?: string;
  year?: number;
  coverUrl: string;
}

export default function NewReviewPage() {
  const router = useRouter();
  const [showScanner, setShowScanner] = useState(false);
  const [loading, setLoading] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [step, setStep] = useState<'metadata' | 'review'>('metadata');

  const [formData, setFormData] = useState({
    title: '',
    authors: '',
    isbn: '',
    publisher: '',
    year: '',
    coverUrl: '',
    rating: 4,
    bulletPoints: [''],
    aiDraft: '',
    finalText: '',
    tags: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      await axios.get('/api/auth/me');
    } catch (error) {
      router.push('/admin/login');
    }
  };

  const handleIsbnScan = (isbn: string) => {
    setFormData({ ...formData, isbn });
    setShowScanner(false);
    fetchBookMetadata(isbn);
  };

  const fetchBookMetadata = async (isbn?: string) => {
    const isbnToSearch = isbn || formData.isbn;
    if (!isbnToSearch) {
      alert('Please enter an ISBN');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get(`/api/books/search?isbn=${isbnToSearch}`);
      const book: BookData = response.data;

      setFormData({
        ...formData,
        title: book.title,
        authors: book.authors.join(', '),
        isbn: book.isbn || isbnToSearch,
        publisher: book.publisher || '',
        year: book.year?.toString() || '',
        coverUrl: book.coverUrl,
      });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Book not found');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBulletPoint = () => {
    setFormData({
      ...formData,
      bulletPoints: [...formData.bulletPoints, ''],
    });
  };

  const handleRemoveBulletPoint = (index: number) => {
    const newBulletPoints = formData.bulletPoints.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      bulletPoints: newBulletPoints.length > 0 ? newBulletPoints : [''],
    });
  };

  const handleBulletPointChange = (index: number, value: string) => {
    const newBulletPoints = [...formData.bulletPoints];
    newBulletPoints[index] = value;
    setFormData({
      ...formData,
      bulletPoints: newBulletPoints,
    });
  };

  const handleGenerateReview = async () => {
    const validBulletPoints = formData.bulletPoints.filter((bp) => bp.trim());
    
    if (validBulletPoints.length === 0) {
      alert('Please add at least one bullet point');
      return;
    }

    if (!formData.title || !formData.authors) {
      alert('Please fill in book title and author');
      return;
    }

    try {
      setAiGenerating(true);
      const response = await axios.post('/api/ai/generate', {
        bulletPoints: validBulletPoints,
        bookTitle: formData.title,
        author: formData.authors.split(',')[0].trim(),
      });

      setFormData({
        ...formData,
        aiDraft: response.data.review,
        finalText: response.data.review,
      });
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to generate review');
    } finally {
      setAiGenerating(false);
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.authors.trim()) newErrors.authors = 'Author is required';
    if (!formData.coverUrl.trim()) newErrors.coverUrl = 'Cover URL is required';
    if (!formData.finalText.trim()) newErrors.finalText = 'Review text is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const reviewData = {
        title: formData.title,
        authors: formData.authors.split(',').map((a) => a.trim()),
        isbn: formData.isbn || undefined,
        publisher: formData.publisher || undefined,
        year: formData.year ? parseInt(formData.year) : undefined,
        coverUrl: formData.coverUrl,
        rating: formData.rating,
        bulletPoints: formData.bulletPoints.filter((bp) => bp.trim()),
        aiDraft: formData.aiDraft || undefined,
        finalText: formData.finalText,
        tags: formData.tags.split(',').map((t) => t.trim()).filter((t) => t),
        status: formData.status,
      };

      const response = await axios.post('/api/reviews', reviewData);

      if (response.data.success) {
        router.push('/admin/dashboard');
      }
    } catch (error: any) {
      alert(error.response?.data?.error || 'Failed to create review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream">
      {/* Header */}
      <header className="bg-white border-b border-rose/20 sticky top-0 z-40">
        <div className="bookish-container">
          <div className="flex items-center justify-between h-16">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-dusty hover:text-rose transition-colors"
            >
              <FaArrowLeft />
              <span className="font-medium">Back to Dashboard</span>
            </Link>

            <div className="flex items-center gap-2">
              <FaBook className="text-2xl text-dusty" />
              <span className="text-xl font-serif font-bold text-charcoal">
                New Review
              </span>
            </div>

            <div className="w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bookish-container py-12">
        <div className="max-w-4xl mx-auto">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Step 1: Book Metadata */}
            <div className="card p-8">
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                Step 1: Book Information
              </h2>

              {/* ISBN Scanner */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  ISBN
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter ISBN"
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowScanner(true)}
                    className="flex items-center gap-2"
                  >
                    <FaCamera />
                    Scan
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fetchBookMetadata()}
                    isLoading={loading}
                  >
                    Fetch
                  </Button>
                </div>
              </div>

              {/* Manual Entry Fields */}
              <div className="space-y-4">
                <Input
                  label="Title *"
                  placeholder="Book title"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  error={errors.title}
                  required
                />

                <Input
                  label="Authors * (comma-separated)"
                  placeholder="Author Name, Co-author Name"
                  value={formData.authors}
                  onChange={(e) =>
                    setFormData({ ...formData, authors: e.target.value })
                  }
                  error={errors.authors}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Publisher"
                    placeholder="Publisher name"
                    value={formData.publisher}
                    onChange={(e) =>
                      setFormData({ ...formData, publisher: e.target.value })
                    }
                  />

                  <Input
                    label="Year"
                    type="number"
                    placeholder="2024"
                    value={formData.year}
                    onChange={(e) =>
                      setFormData({ ...formData, year: e.target.value })
                    }
                  />
                </div>

                <Input
                  label="Cover URL *"
                  placeholder="https://covers.openlibrary.org/..."
                  value={formData.coverUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, coverUrl: e.target.value })
                  }
                  error={errors.coverUrl}
                  required
                />

                {/* Cover Preview */}
                {formData.coverUrl && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-charcoal mb-2">
                      Cover Preview
                    </label>
                    <img
                      src={formData.coverUrl}
                      alt="Book cover preview"
                      className="w-48 rounded-lg shadow-soft"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          'https://via.placeholder.com/400x600/E7C6C1/1F1F1F?text=Invalid+URL';
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Step 2: Review Content */}
            <div className="card p-8">
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                Step 2: Write Review
              </h2>

              {/* Rating */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Rating *
                </label>
                <StarRating
                  rating={formData.rating}
                  editable
                  onChange={(rating) => setFormData({ ...formData, rating })}
                  size={32}
                />
              </div>

              {/* Bullet Points */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  Your Thoughts (Bullet Points)
                </label>
                <p className="text-sm text-charcoal/60 mb-4">
                  Jot down your main thoughts. AI will help turn these into a polished review!
                </p>

                <div className="space-y-3">
                  {formData.bulletPoints.map((point, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        placeholder={`Point ${index + 1}`}
                        value={point}
                        onChange={(e) =>
                          handleBulletPointChange(index, e.target.value)
                        }
                        className="flex-1"
                      />
                      {formData.bulletPoints.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleRemoveBulletPoint(index)}
                          className="text-red-600"
                        >
                          ✕
                        </Button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-2 mt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddBulletPoint}
                  >
                    + Add Point
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleGenerateReview}
                    isLoading={aiGenerating}
                    className="flex items-center gap-2"
                    disabled={formData.bulletPoints.filter((bp) => bp.trim()).length === 0}
                  >
                    <FaMagic />
                    Generate Review with AI
                  </Button>
                </div>
              </div>

              {/* Final Review Text */}
              <Textarea
                label="Final Review Text *"
                placeholder="Write or edit your review here..."
                rows={12}
                value={formData.finalText}
                onChange={(e) =>
                  setFormData({ ...formData, finalText: e.target.value })
                }
                error={errors.finalText}
                required
              />

              {/* Tags */}
              <div className="mt-4">
                <Input
                  label="Tags / Genres (comma-separated)"
                  placeholder="Romance, Contemporary, Fiction"
                  value={formData.tags}
                  onChange={(e) =>
                    setFormData({ ...formData, tags: e.target.value })
                  }
                />
              </div>
            </div>

            {/* Publish Options */}
            <div className="card p-8">
              <h2 className="text-2xl font-serif font-bold text-charcoal mb-6">
                Step 3: Publish
              </h2>

              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Status
                </label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={formData.status === 'draft'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-4 h-4 text-dusty"
                    />
                    <span>Save as Draft</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={formData.status === 'published'}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-4 h-4 text-dusty"
                    />
                    <span>Publish Now</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  className="flex-1"
                >
                  {formData.status === 'published' ? 'Publish Review' : 'Save Draft'}
                </Button>
                <Link href="/admin/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </main>

      {/* Barcode Scanner Modal */}
      {showScanner && (
        <BarcodeScanner
          onScan={handleIsbnScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
}

