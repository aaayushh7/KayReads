'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import StarRating from '@/components/ui/StarRating';
import BarcodeScanner from '@/components/admin/BarcodeScanner';
import TagSelector from '@/components/admin/TagSelector';
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

      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-20 right-4 bg-green-100 border border-green-400 text-green-700 px-6 py-3 rounded-xl shadow-lg z-50';
      successMsg.textContent = `✓ Found: ${book.title}`;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);

    } catch (error: any) {
      const errorMsg = error.response?.data?.error || 'Book not found. Try a different ISBN or enter details manually.';
      
      // Show error message
      const errorDiv = document.createElement('div');
      errorDiv.className = 'fixed top-20 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-3 rounded-xl shadow-lg z-50';
      errorDiv.textContent = `✗ ${errorMsg}`;
      document.body.appendChild(errorDiv);
      setTimeout(() => errorDiv.remove(), 5000);
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
      <header className="bg-white border-b border-rose/20 sticky top-0 z-40 shadow-softer">
        <div className="bookish-container">
          <div className="flex items-center justify-between h-16 lg:h-18">
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-2 text-dusty hover:text-rose transition-colors font-medium"
            >
              <FaArrowLeft />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
            </Link>

            <div className="flex items-center gap-2">
              <FaBook className="text-xl lg:text-2xl text-dusty" />
              <span className="text-lg lg:text-xl font-serif font-bold text-charcoal">
                New Review
              </span>
            </div>

            <div className="w-20 sm:w-32" /> {/* Spacer for centering */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="bookish-container py-8 lg:py-12">
        <div className="max-w-4xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8 flex items-center justify-center gap-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-dusty text-white flex items-center justify-center text-sm font-bold">1</div>
              <span className="text-sm font-medium text-charcoal">Book Info</span>
            </div>
            <div className="w-12 h-0.5 bg-rose/30" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formData.title ? 'bg-dusty text-white' : 'bg-rose/20 text-charcoal/40'}`}>2</div>
              <span className={`text-sm font-medium ${formData.title ? 'text-charcoal' : 'text-charcoal/40'}`}>Review</span>
            </div>
            <div className="w-12 h-0.5 bg-rose/30" />
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${formData.finalText ? 'bg-dusty text-white' : 'bg-rose/20 text-charcoal/40'}`}>3</div>
              <span className={`text-sm font-medium ${formData.finalText ? 'text-charcoal' : 'text-charcoal/40'}`}>Publish</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 lg:space-y-8">
            {/* Step 1: Book Metadata */}
            <div className="card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-dusty/10 flex items-center justify-center">
                  <span className="text-dusty font-bold text-lg">1</span>
                </div>
                <h2 className="text-xl lg:text-2xl font-serif font-bold text-charcoal">
                  Book Information
                </h2>
              </div>

              <div className="bg-rose/5 border border-rose/20 rounded-xl p-4 mb-6">
                <p className="text-sm text-charcoal/70 leading-relaxed">
                  <strong className="text-dusty">Quick Start:</strong> Either scan the book's barcode, paste the ISBN from Amazon/Goodreads, or type it manually. We'll fetch all the details for you!
                </p>
              </div>

              {/* ISBN Scanner */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-charcoal mb-2">
                  ISBN (10 or 13 digits)
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste or type ISBN here"
                    value={formData.isbn}
                    onChange={(e) =>
                      setFormData({ ...formData, isbn: e.target.value })
                    }
                    onPaste={(e) => {
                      e.stopPropagation();
                      const pasteData = e.clipboardData.getData('text');
                      const cleanIsbn = pasteData.replace(/\D/g, ''); // Remove non-digits
                      setFormData({ ...formData, isbn: cleanIsbn });
                      e.preventDefault();
                    }}
                    className="flex-1"
                    autoComplete="off"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowScanner(true)}
                    className="flex items-center gap-2 flex-shrink-0"
                  >
                    <FaCamera />
                    <span className="hidden sm:inline">Scan</span>
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => fetchBookMetadata()}
                    isLoading={loading}
                    disabled={!formData.isbn}
                    className="flex-shrink-0"
                  >
                    {loading ? 'Fetching...' : 'Fetch'}
                  </Button>
                </div>
                <p className="mt-2 text-xs text-charcoal/50">
                  💡 Tip: Scan barcode, paste from Amazon/Goodreads, or type manually
                </p>
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
            <div className="card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-dusty/10 flex items-center justify-center">
                  <span className="text-dusty font-bold text-lg">2</span>
                </div>
                <h2 className="text-xl lg:text-2xl font-serif font-bold text-charcoal">
                  Write Review
                </h2>
              </div>

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
              <div className="mt-6">
                <label className="block text-sm font-medium text-charcoal mb-3">
                  Tags / Genres
                </label>
                <TagSelector
                  selectedTags={formData.tags.split(',').map(t => t.trim()).filter(t => t)}
                  onChange={(tags) => setFormData({ ...formData, tags: tags.join(', ') })}
                />
              </div>
            </div>

            {/* Publish Options */}
            <div className="card p-6 lg:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-dusty/10 flex items-center justify-center">
                  <span className="text-dusty font-bold text-lg">3</span>
                </div>
                <h2 className="text-xl lg:text-2xl font-serif font-bold text-charcoal">
                  Publish
                </h2>
              </div>

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

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={loading}
                  className="flex-1 shadow-soft hover:shadow-lg"
                >
                  {formData.status === 'published' ? '🚀 Publish Review' : '💾 Save Draft'}
                </Button>
                <Link href="/admin/dashboard" className="flex-shrink-0">
                  <Button type="button" variant="outline" className="w-full sm:w-auto">
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

