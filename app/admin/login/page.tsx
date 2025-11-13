'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { FaBook, FaLock } from 'react-icons/fa';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await axios.post('/api/auth/login', formData);
      
      if (response.data.success) {
        router.push('/admin/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose/20 via-cream to-dusty/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <FaBook className="text-5xl text-dusty" />
          </div>
          <h1 className="text-4xl font-serif font-bold text-charcoal mb-2">
            Kayin Books
          </h1>
          <p className="text-charcoal/60">Admin Panel</p>
        </div>

        {/* Login Card */}
        <div className="card p-8">
          <div className="flex items-center gap-2 mb-6">
            <FaLock className="text-dusty text-xl" />
            <h2 className="text-2xl font-serif font-bold text-charcoal">
              Sign In
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email"
              type="email"
              placeholder="admin@kayinbooks.com"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              isLoading={loading}
              className="w-full"
            >
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-charcoal/60">
            <p>
              First time? Set up admin account using the{' '}
              <code className="px-2 py-1 bg-rose/10 rounded">/api/auth/init</code>{' '}
              endpoint
            </p>
          </div>
        </div>

        <div className="text-center mt-6 text-sm text-charcoal/50">
          <a href="/" className="hover:text-dusty transition-colors">
            ← Back to website
          </a>
        </div>
      </div>
    </div>
  );
}

