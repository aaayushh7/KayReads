'use client';

import React, { useState } from 'react';
import { FaTimes, FaPlus } from 'react-icons/fa';

interface TagSelectorProps {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
}

const POPULAR_TAGS = [
  'Fiction',
  'Non-Fiction',
  'Romance',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Science Fiction',
  'Young Adult',
  'Contemporary',
  'Historical Fiction',
  'Literary Fiction',
  'Horror',
  'Biography',
  'Self-Help',
  'Memoir',
  'Poetry',
  'Adventure',
  'Dystopian',
  'Paranormal',
  'Comedy',
  'Drama',
  'Crime',
  'Suspense',
  'Magic',
  'Coming of Age',
];

export default function TagSelector({ selectedTags, onChange }: TagSelectorProps) {
  const [customTag, setCustomTag] = useState('');

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const addCustomTag = () => {
    if (customTag.trim() && !selectedTags.includes(customTag.trim())) {
      onChange([...selectedTags, customTag.trim()]);
      setCustomTag('');
    }
  };

  const removeTag = (tag: string) => {
    onChange(selectedTags.filter(t => t !== tag));
  };

  return (
    <div className="space-y-4">
      {/* Selected Tags */}
      {selectedTags.length > 0 && (
        <div>
          <label className="block text-sm font-medium text-charcoal mb-2">
            Selected Tags ({selectedTags.length})
          </label>
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-dusty/10 border border-dusty/30 rounded-full text-sm text-charcoal hover:bg-dusty/20 transition-colors"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="hover:text-red-600 transition-colors"
                >
                  <FaTimes size={12} />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Popular Tags */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Popular Tags (click to add)
        </label>
        <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-4 bg-cream/50 rounded-xl border border-rose/10">
          {POPULAR_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => toggleTag(tag)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedTags.includes(tag)
                  ? 'bg-dusty text-white shadow-soft'
                  : 'bg-white text-charcoal/70 border border-rose/20 hover:border-dusty/40 hover:bg-rose/5'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Custom Tag Input */}
      <div>
        <label className="block text-sm font-medium text-charcoal mb-2">
          Add Custom Tag
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addCustomTag();
              }
            }}
            placeholder="Type custom tag..."
            className="input flex-1"
          />
          <button
            type="button"
            onClick={addCustomTag}
            disabled={!customTag.trim()}
            className="btn-secondary px-4 disabled:opacity-50"
          >
            <FaPlus />
          </button>
        </div>
      </div>
    </div>
  );
}

