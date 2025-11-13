'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBook, FaSearch, FaInfoCircle, FaBars, FaTimes } from 'react-icons/fa';

export default function Navbar() {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith('/admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isAdmin) {
    return null; // Don't show public navbar in admin area
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose/20 shadow-softer">
      <div className="bookish-container">
        <div className="flex items-center justify-between h-16 lg:h-18">
          {/* Logo - Compact on mobile */}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl sm:text-2xl font-serif font-bold text-charcoal hover:text-dusty transition-colors flex-shrink-0"
            onClick={closeMobileMenu}
          >
            <img src="/logo.png" alt="Kay Reads" className="w-9 h-9 sm:w-10 sm:h-10 object-contain" />
            <span className="hidden xs:inline italic font-medium" style={{ fontFamily: 'var(--font-family-serif)' }}>Kay Reads!</span>
            <span className="inline xs:hidden italic" style={{ fontFamily: 'var(--font-family-serif)' }}>KR</span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link
              href="/reviews"
              className={`flex items-center gap-2 font-medium transition-colors touch-target ${
                pathname === '/reviews'
                  ? 'text-dusty'
                  : 'text-charcoal/70 hover:text-dusty'
              }`}
            >
              <FaSearch size={16} />
              <span>Browse</span>
            </Link>
            <Link
              href="/about"
              className={`flex items-center gap-2 font-medium transition-colors touch-target ${
                pathname === '/about'
                  ? 'text-dusty'
                  : 'text-charcoal/70 hover:text-dusty'
              }`}
            >
              <FaInfoCircle size={16} />
              <span>About</span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-charcoal hover:text-dusty transition-colors touch-target"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <FaTimes size={24} />
            ) : (
              <FaBars size={24} />
            )}
          </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute left-0 right-0 top-16 bg-white border-b border-rose/20 shadow-lg">
            <div className="bookish-container py-4 space-y-1">
              <Link
                href="/reviews"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors touch-target ${
                  pathname === '/reviews'
                    ? 'bg-dusty/10 text-dusty'
                    : 'text-charcoal/70 hover:bg-rose/10 hover:text-dusty'
                }`}
              >
                <FaSearch size={18} />
                <span>Browse Reviews</span>
              </Link>
              <Link
                href="/about"
                onClick={closeMobileMenu}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-colors touch-target ${
                  pathname === '/about'
                    ? 'bg-dusty/10 text-dusty'
                    : 'text-charcoal/70 hover:bg-rose/10 hover:text-dusty'
                }`}
              >
                <FaInfoCircle size={18} />
                <span>About</span>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

