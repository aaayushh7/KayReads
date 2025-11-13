import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface BookMetadata {
  title: string;
  authors: string[];
  isbn?: string;
  publisher?: string;
  year?: number;
  coverUrl: string;
  description?: string;
  source: 'openlibrary' | 'googlebooks';
}

async function searchOpenLibrary(isbn: string): Promise<BookMetadata | null> {
  try {
    const response = await axios.get(
      `https://openlibrary.org/api/books?bibkeys=ISBN:${isbn}&format=json&jscmd=data`
    );

    const data = response.data;
    const key = `ISBN:${isbn}`;

    if (!data[key]) {
      return null;
    }

    const book = data[key];

    // Get cover URL - prefer large, then medium, then small
    let coverUrl = 'https://via.placeholder.com/400x600/E7C6C1/1F1F1F?text=No+Cover';
    
    if (book.cover) {
      if (book.cover.large) {
        coverUrl = book.cover.large;
      } else if (book.cover.medium) {
        coverUrl = book.cover.medium;
      } else if (book.cover.small) {
        coverUrl = book.cover.small;
      }
    }

    return {
      title: book.title || '',
      authors: book.authors ? book.authors.map((a: any) => a.name) : [],
      isbn,
      publisher: book.publishers?.[0]?.name || '',
      year: book.publish_date ? parseInt(book.publish_date) : undefined,
      coverUrl,
      description: book.excerpts?.[0]?.text || book.description || '',
      source: 'openlibrary',
    };
  } catch (error) {
    console.error('OpenLibrary error:', error);
    return null;
  }
}

async function searchGoogleBooks(isbn: string): Promise<BookMetadata | null> {
  try {
    const response = await axios.get(
      `https://www.googleapis.com/books/v1/volumes?q=isbn:${isbn}`
    );

    const data = response.data;

    if (!data.items || data.items.length === 0) {
      return null;
    }

    const book = data.items[0].volumeInfo;

    // Get cover URL - prefer high-res
    let coverUrl = 'https://via.placeholder.com/400x600/E7C6C1/1F1F1F?text=No+Cover';
    
    if (book.imageLinks) {
      if (book.imageLinks.large) {
        coverUrl = book.imageLinks.large;
      } else if (book.imageLinks.medium) {
        coverUrl = book.imageLinks.medium;
      } else if (book.imageLinks.thumbnail) {
        coverUrl = book.imageLinks.thumbnail.replace('http://', 'https://');
      } else if (book.imageLinks.smallThumbnail) {
        coverUrl = book.imageLinks.smallThumbnail.replace('http://', 'https://');
      }
    }

    return {
      title: book.title || '',
      authors: book.authors || [],
      isbn,
      publisher: book.publisher || '',
      year: book.publishedDate ? parseInt(book.publishedDate.substring(0, 4)) : undefined,
      coverUrl,
      description: book.description || '',
      source: 'googlebooks',
    };
  } catch (error) {
    console.error('GoogleBooks error:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const isbn = searchParams.get('isbn');

    if (!isbn) {
      return NextResponse.json(
        { error: 'ISBN is required' },
        { status: 400 }
      );
    }

    // Clean ISBN (remove hyphens and spaces)
    const cleanIsbn = isbn.replace(/[-\s]/g, '');

    // Try OpenLibrary first
    let bookData = await searchOpenLibrary(cleanIsbn);

    // If not found, try Google Books
    if (!bookData) {
      bookData = await searchGoogleBooks(cleanIsbn);
    }

    if (!bookData) {
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(bookData);
  } catch (error) {
    console.error('Book search error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

