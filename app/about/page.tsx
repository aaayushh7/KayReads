'use client';

import React from 'react';
import Navbar from '@/components/ui/Navbar';
import { FaBook, FaHeart, FaCoffee } from 'react-icons/fa';

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* Hero */}
      <section className="bg-gradient-to-b from-rose/10 to-cream py-20">
        <div className="bookish-container text-center">
          <FaBook className="text-6xl text-dusty mx-auto mb-6" />
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-charcoal mb-6">
            About This Book Corner
          </h1>
          <p className="text-xl text-charcoal/70 max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-family-quote)', fontStyle: 'italic', lineHeight: '1.6' }}>
            Welcome to my cozy little corner of the internet where I share honest,
            heartfelt reviews of the books that move me, inspire me, and sometimes
            frustrate me.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="bookish-container py-20">
        <div className="max-w-4xl mx-auto">
          <div className="card p-8 md:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FaHeart className="text-3xl text-dusty" />
              <h2 className="text-3xl font-serif font-bold text-charcoal">
                Why I Review Books
              </h2>
            </div>
            <div className="bookish-prose">
              <p>
                I'm just a book girly who loves to read and share my thoughts about
                the stories that captivate me. This site is my passion project—a place
                where I can express my genuine reactions to books without filters or
                algorithms getting in the way.
              </p>
              <p>
                Every review you read here is written from the heart. I don't do
                sponsored posts or rate books I haven't read. Just honest opinions
                about the books I've finished (or sometimes, couldn't finish).
              </p>
              <p>
                Whether you're looking for your next great read or just want to see
                if someone else felt the same way about that plot twist, I hope you
                find what you're looking for here.
              </p>
            </div>
          </div>

          <div className="card p-8 md:p-12 mb-12">
            <div className="flex items-center gap-3 mb-6">
              <FaCoffee className="text-3xl text-dusty" />
              <h2 className="text-3xl font-serif font-bold text-charcoal">
                What I Read
              </h2>
            </div>
            <div className="bookish-prose">
              <p>
                My reading taste is all over the place, and I love it that way! You'll
                find reviews of contemporary fiction, romance, fantasy, thrillers,
                literary fiction, and the occasional non-fiction that catches my eye.
              </p>
              <p>
                I'm always open to recommendations, and I love discovering hidden gems
                that don't always make it to the bestseller lists. If you have a book
                you think I should read, drop a comment on one of my reviews!
              </p>
            </div>
          </div>

          <div className="card p-8 md:p-12">
            <h2 className="text-3xl font-serif font-bold text-charcoal mb-6">
              My Rating System
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-gold text-2xl">★★★★★</div>
                <div>
                  <strong className="text-charcoal">5 Stars:</strong>
                  <p className="text-charcoal/70">
                    A new favorite! Books that will stay with me forever and that I'll
                    recommend to everyone.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-gold text-2xl">★★★★☆</div>
                <div>
                  <strong className="text-charcoal">4 Stars:</strong>
                  <p className="text-charcoal/70">
                    Really enjoyed it! Minor issues, but overall a great read I'd
                    recommend.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-gold text-2xl">★★★☆☆</div>
                <div>
                  <strong className="text-charcoal">3 Stars:</strong>
                  <p className="text-charcoal/70">
                    It was okay. Some good parts, some not-so-good parts. Worth a read
                    if the premise interests you.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-gold text-2xl">★★☆☆☆</div>
                <div>
                  <strong className="text-charcoal">2 Stars:</strong>
                  <p className="text-charcoal/70">
                    Disappointed. Had potential but didn't work for me.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-24 text-gold text-2xl">★☆☆☆☆</div>
                <div>
                  <strong className="text-charcoal">1 Star:</strong>
                  <p className="text-charcoal/70">
                    Really didn't enjoy it. Life's too short for books like this.
                  </p>
                </div>
              </div>
            </div>
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

