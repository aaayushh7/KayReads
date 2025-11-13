# 🚀 Quick Start Guide

Get your book review site running in 5 minutes!

## Prerequisites
- Node.js 18+ installed
- MongoDB Atlas account (free at https://www.mongodb.com/cloud/atlas/register)
- HuggingFace account (free at https://huggingface.co/join)

## Step-by-Step Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up MongoDB Atlas

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Create a free cluster (M0 Sandbox)
3. Create a database user:
   - Go to Database Access → Add New Database User
   - Choose "Password" authentication
   - Save username and password
4. Whitelist your IP:
   - Go to Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (for development)
5. Get connection string:
   - Go to Database → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database password

### 3. Get HuggingFace API Token

1. Go to https://huggingface.co/settings/tokens
2. Click "New token"
3. Name it "kayinbooks" and select "Read" role
4. Copy the token (starts with `hf_`)

### 4. Configure Environment

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` and fill in:
```env
MONGODB_URI=your-mongodb-connection-string-here
JWT_SECRET=your-random-secret-key-here
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
HUGGINGFACE_API_TOKEN=hf_your_token_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

**Generate a secure JWT_SECRET:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# Or use any random string generator
```

### 5. Start Development Server
```bash
npm run dev
```

You should see:
```
✓ Starting...
✓ Ready in X ms
○ Local:        http://localhost:3000
```

### 6. Create Admin Account

Open a new terminal and run:
```bash
npm run init-admin
```

You should see:
```
✅ Admin user created successfully!
📧 Email: your-email@example.com
🎉 You can now log in at /admin/login
```

### 7. Log In and Create Your First Review!

1. Open http://localhost:3000/admin/login
2. Log in with your admin credentials
3. Click "New Review"
4. Either:
   - Click "Scan" to use your camera for ISBN barcode
   - Or type an ISBN manually (try: 9780439708180 for Harry Potter)
5. Click "Fetch" to auto-populate book details
6. Add your thoughts as bullet points
7. Click "Generate Review with AI"
8. Edit the generated text as you like
9. Add tags and rating
10. Click "Publish Review"

### 8. View Your Public Site

Visit http://localhost:3000 to see your beautiful book review site!

## Common Issues

### "Cannot connect to MongoDB"
- Check your MongoDB connection string is correct
- Make sure you whitelisted your IP address
- Verify database user credentials

### "Camera not working for barcode scan"
- Camera only works on HTTPS in production
- Use localhost in development or enter ISBN manually
- Check browser camera permissions

### "AI generation not working"
- Verify HuggingFace API token is correct
- First request may be slow (model loading)
- Check you have internet connection

### "Book not found"
- Try different ISBN format (10 vs 13 digits)
- Some books may not be in Open Library/Google Books
- You can enter book details manually

## Next Steps

- **Customize Design**: Edit colors in `tailwind.config.ts`
- **Add More Books**: Create reviews from `/admin/dashboard`
- **Deploy to Production**: See deployment section in main README
- **Backup Database**: Export from MongoDB Atlas regularly

## Need Help?

- Check the main [README.md](./README.md) for detailed documentation
- Review [API documentation](#) for integration details
- Open an issue on GitHub if you encounter problems

---

Happy reviewing! 📚💕

