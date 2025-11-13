# 📚 Kayin Books - A Book Girly's Reading Corner

A beautiful, mobile-first book review website built with Next.js, featuring AI-powered review generation, barcode scanning, and nested Reddit-style comments. Designed with an elegant, feminine aesthetic perfect for book lovers!

## ✨ Features

### 🎨 Beautiful Design
- Soft, bookish color palette (cream, rose, dusty pink, gold)
- Playfair Display serif headings + Inter body text
- Smooth animations and micro-interactions
- Mobile-first responsive design

### 📖 Review Features
- Hero carousel showcasing latest reviews
- Grid/list view with advanced filtering
- Single review pages with next/prev navigation
- Star ratings and tags
- Reddit-style nested comments with infinite threading

### 🔐 Admin Panel
- Secure JWT authentication with httpOnly cookies
- Create/edit/delete reviews
- Barcode scanning for ISBN lookup (ZXing)
- Auto-fetch book metadata from Open Library + Google Books
- AI-powered review generation from bullet points (HuggingFace)
- Draft and publish workflow

### 🆓 100% Free Infrastructure
- **Database**: MongoDB Atlas (free tier)
- **APIs**: Open Library, Google Books API (free)
- **AI**: HuggingFace Inference API (free models)
- **Images**: URLs only (no storage costs)
- **Hosting**: Deploy to Vercel (free)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- MongoDB Atlas account (free)
- HuggingFace account (free)

### Installation

1. **Clone and install dependencies**
```bash
git clone <your-repo-url>
cd kayinbooks
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env.local
```

Edit `.env.local` with your values:
```env
# MongoDB Atlas Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kayinbooks?retryWrites=true&w=majority

# JWT Secret (generate with: openssl rand -base64 32)
JWT_SECRET=your-super-secret-jwt-key-change-this

# Admin Credentials (for first-time setup)
ADMIN_EMAIL=admin@kayinbooks.com
ADMIN_PASSWORD=changeme123

# HuggingFace API Token (get from https://huggingface.co/settings/tokens)
HUGGINGFACE_API_TOKEN=hf_your_token_here

# Base URL
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

3. **Start the development server**
```bash
npm run dev
```

4. **Create admin user** (one-time setup)

In a new terminal, run:
```bash
npm run init-admin
```

Or manually:
```bash
curl -X POST http://localhost:3000/api/auth/init
```

5. **Start using the app!**
- Visit http://localhost:3000 for the public site
- Visit http://localhost:3000/admin/login to log in as admin

## 📁 Project Structure

```
kayinbooks/
├── app/
│   ├── admin/           # Admin panel pages
│   │   ├── login/       # Admin login
│   │   ├── dashboard/   # Manage reviews
│   │   └── new/         # Create new review
│   ├── api/             # API routes
│   │   ├── auth/        # Authentication endpoints
│   │   ├── books/       # Book metadata search
│   │   ├── reviews/     # Review CRUD
│   │   ├── comments/    # Comment system
│   │   └── ai/          # AI generation
│   ├── reviews/         # Browse all reviews
│   ├── review/[slug]/   # Single review page
│   ├── about/           # About page
│   └── page.tsx         # Home page (carousel)
├── components/
│   ├── ui/              # Reusable UI components
│   ├── admin/           # Admin-specific components
│   └── public/          # Public-facing components
├── lib/                 # Utilities
│   ├── mongodb.ts       # Database connection
│   └── jwt.ts           # JWT helpers
├── models/              # Mongoose schemas
│   ├── User.ts
│   ├── Review.ts
│   └── Comment.ts
└── middleware/          # Auth middleware
```

## 🎯 Usage Guide

### For Admins: Creating a Review

1. **Log in** at `/admin/login`

2. **Create new review** at `/admin/new`:
   - Scan ISBN barcode or enter manually
   - Click "Fetch" to auto-populate metadata
   - Add your thoughts as bullet points
   - Click "Generate Review with AI" for a polished draft
   - Edit the final text as needed
   - Add tags and rating
   - Save as draft or publish immediately

3. **Manage reviews** at `/admin/dashboard`:
   - View all reviews (drafts and published)
   - Edit or delete existing reviews
   - Quick preview of published reviews

### For Readers

- **Browse** latest reviews on the home page
- **Search & filter** at `/reviews`
- **Read full reviews** with next/prev navigation
- **Leave comments** and reply to others
- **Share** reviews on social media

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Check auth status
- `POST /api/auth/init` - Create initial admin user

### Reviews
- `GET /api/reviews` - List reviews (with filters)
- `GET /api/reviews/[id]` - Get single review
- `POST /api/reviews` - Create review (admin)
- `PUT /api/reviews/[id]` - Update review (admin)
- `DELETE /api/reviews/[id]` - Delete review (admin)

### Books
- `GET /api/books/search?isbn=XXX` - Fetch book metadata

### Comments
- `GET /api/comments?reviewId=XXX` - Get comments for review
- `POST /api/comments` - Post new comment

### AI
- `POST /api/ai/generate` - Generate review from bullet points

## 🎨 Design Tokens

```css
Colors:
  --cream: #FAF7F2
  --rose: #E7C6C1
  --dusty: #D8A7A1
  --charcoal: #1F1F1F
  --gold: #C9A27A

Fonts:
  --font-serif: Playfair Display
  --font-sans: Inter
```

## 🌐 Deployment

### Vercel (Recommended)

1. Push code to GitHub

2. Import project in Vercel

3. Add environment variables in Vercel dashboard

4. Deploy!

### Environment Variables for Production
Make sure to set all variables from `.env.example` in your hosting provider's dashboard.

**Important**: Change `JWT_SECRET` and `ADMIN_PASSWORD` to secure values in production!

## 🆓 Free Service Limits

### MongoDB Atlas (Free Tier)
- 512 MB storage
- Shared RAM
- Perfect for small-medium review sites

### Open Library API
- Unlimited requests
- No API key needed

### Google Books API
- 1,000 requests/day (free)
- More than enough for manual entry

### HuggingFace Inference API
- Free tier available
- Rate limited but sufficient for review generation
- Alternative: use local models or other free LLM APIs

## 🐛 Troubleshooting

**Camera not working for barcode scanning?**
- Ensure HTTPS in production (required for camera access)
- Grant camera permissions in browser
- Fallback: enter ISBN manually

**AI generation not working?**
- Check HuggingFace API token is valid
- Model may be loading (first request can be slow)
- Fallback: formatted bullet points returned if AI fails

**Book not found?**
- Try different ISBN format (10 vs 13 digits)
- Some books may not be in Open Library or Google Books
- Enter metadata manually

## 📝 License

MIT License - feel free to use this for your own book review site!

## 💖 Acknowledgments

- Book data from [Open Library](https://openlibrary.org/) and [Google Books](https://books.google.com/)
- AI powered by [HuggingFace](https://huggingface.co/)
- Barcode scanning with [ZXing](https://github.com/zxing-js/library)
- Beautiful icons from [React Icons](https://react-icons.github.io/react-icons/)

---

Built with 💕 for book girlies everywhere
