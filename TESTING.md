# 🧪 Testing Your Book Review Site

This guide will help you verify that everything works correctly.

## ✅ Pre-Launch Checklist

### 1. Environment Setup
- [ ] `.env.local` file created with all variables
- [ ] MongoDB Atlas cluster running
- [ ] HuggingFace API token obtained
- [ ] Admin credentials set

### 2. Installation
```bash
npm install          # Should complete without errors
npm run build        # Should build successfully
```

## 🔍 Feature Testing

### Test 1: Start Development Server

```bash
npm run dev
```

**Expected:**
```
✓ Starting...
✓ Ready in X ms
○ Local:        http://localhost:3000
```

**Visit:** http://localhost:3000

**You should see:**
- Beautiful home page with book review carousel
- Navbar with "Browse Reviews" and "About" links
- Cream background with bookish styling

---

### Test 2: Create Admin Account

```bash
npm run init-admin
```

**Expected:**
```
✅ Admin user created successfully!
📧 Email: your-email@example.com
```

**If you see "already exists":** That's okay, admin is set up!

---

### Test 3: Admin Login

1. Visit: http://localhost:3000/admin/login
2. Enter your admin credentials from `.env.local`
3. Click "Sign In"

**Expected:**
- Redirect to `/admin/dashboard`
- See empty state with "New Review" button
- Navbar shows "View Site" and "Logout" buttons

---

### Test 4: Create Your First Review

#### A. Using ISBN Fetch (Easiest)

1. Click "New Review" button
2. Enter ISBN: `9780439708180` (Harry Potter example)
3. Click "Fetch"

**Expected:**
- Title auto-fills: "Harry Potter and the Sorcerer's Stone"
- Authors auto-fill: "J.K. Rowling"
- Publisher and year populate
- Cover image preview appears

#### B. Add Your Review

1. Set rating to 5 stars
2. Add bullet points:
   - "A magical start to an incredible series"
   - "Perfect world-building and character development"
   - "Nostalgia at its finest"
3. Click "Generate Review with AI"

**Expected:**
- AI generates a polished review
- Text appears in "Final Review Text" field
- You can edit the generated text

#### C. Add Tags & Publish

1. Add tags: `Fantasy, Young Adult, Magic`
2. Select "Publish Now"
3. Click "Publish Review"

**Expected:**
- Redirect to dashboard
- Review appears in published list
- Shows cover, title, rating, and actions

---

### Test 5: View Public Review

1. From dashboard, click "View" button on your review
2. OR visit homepage

**Expected:**
- Review appears in home carousel
- Click "Read Full Review" to see full page
- Beautiful layout with cover image, stars, and text
- Tags are clickable
- "Previous" and "Next" navigation (if you have multiple reviews)

---

### Test 6: Comment System

On the single review page:

1. Scroll to comments section
2. Fill in:
   - Name: "Test Reader"
   - Comment: "Great review! I loved this book too."
3. Click "Post Comment"

**Expected:**
- Comment appears immediately
- Shows avatar (first letter of name)
- Shows timestamp
- "Reply" button available

#### Test Reply:

1. Click "Reply" on your comment
2. Enter another comment
3. Post reply

**Expected:**
- Reply appears indented under parent comment
- "Hide replies" / "Show replies" buttons work
- Can nest replies infinitely

---

### Test 7: Browse & Search

1. Click "Browse Reviews" in navbar
2. Try search: Type "Harry"
3. Try sort: Change to "Highest Rated"
4. Try filter: Select a tag from dropdown

**Expected:**
- Search filters reviews in real-time
- Sort changes order
- Tag filter shows only matching reviews
- Results count updates

---

### Test 8: Barcode Scanner (If you have a book)

1. Go to `/admin/new`
2. Click "Scan" button
3. Allow camera access

**Expected:**
- Camera view opens
- Yellow rectangle overlay for targeting
- Scanning happens automatically when barcode is in frame
- ISBN populates when detected

**Note:** Camera only works on HTTPS in production. In development (localhost), it works fine.

---

### Test 9: Edit & Delete

#### Edit Review:
1. From dashboard, click "Edit" on a review
2. Change the rating or text
3. Save changes

**Expected:**
- Changes save successfully
- Updates appear on public site

#### Delete Review:
1. Click "Delete" button
2. Confirm deletion

**Expected:**
- Confirmation prompt
- Review removed from database
- Disappears from public site

---

### Test 10: Logout & Re-login

1. Click "Logout" button
2. Confirm you're redirected to login
3. Try visiting `/admin/dashboard` directly

**Expected:**
- Redirected to login (protected route)
- Can log back in with credentials
- Session persists for 7 days

---

## 🔧 Troubleshooting Tests

### MongoDB Connection Issues

**Test:**
```bash
# Check if MongoDB URI is correct
echo $MONGODB_URI  # Should show connection string
```

**Fix:**
- Verify IP whitelist in MongoDB Atlas
- Check username/password in connection string
- Ensure cluster is running

---

### API Fetch Not Working

**Test:**
```bash
curl "http://localhost:3000/api/books/search?isbn=9780439708180"
```

**Expected:**
```json
{
  "title": "Harry Potter and the Sorcerer's Stone",
  "authors": ["J.K. Rowling"],
  ...
}
```

**Fix:**
- Check internet connection
- Try different ISBN
- Open browser dev tools to see network errors

---

### AI Generation Fails

**Test:**
```bash
# Check HuggingFace token
echo $HUGGINGFACE_API_TOKEN
```

**Expected:** Should start with `hf_`

**Fix:**
- Verify token is valid at https://huggingface.co/settings/tokens
- Wait 30 seconds (model may be loading)
- Check browser console for errors
- Fallback: formatted bullet points will be used

---

### Build Errors

**Test:**
```bash
npm run build
```

**If fails:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

---

## 📊 Success Criteria

Your site is working correctly if:

✅ Home page loads with reviews
✅ Can log in as admin
✅ Can create new review with ISBN fetch
✅ AI generates review text
✅ Review publishes to public site
✅ Can leave comments and replies
✅ Search and filters work
✅ Mobile layout looks good
✅ No console errors
✅ Build completes successfully

---

## 🚀 Ready to Deploy?

If all tests pass, you're ready to deploy to production!

**Deployment Checklist:**
- [ ] All tests passing
- [ ] `.env` variables configured for production
- [ ] MongoDB Atlas IP whitelist updated (allow all for cloud hosting)
- [ ] Change `JWT_SECRET` to a new secure value
- [ ] Update `NEXT_PUBLIC_BASE_URL` to your domain
- [ ] Test on mobile devices
- [ ] Review security settings

See README.md for Vercel deployment instructions.

---

## 💡 Testing Tips

1. **Use Real Books**: Test with actual ISBNs from books you own
2. **Test Mobile**: Use Chrome DevTools device emulation
3. **Test Comments**: Create conversations to verify nesting
4. **Test Search**: Try various queries and edge cases
5. **Test Errors**: Try invalid ISBNs, empty forms, etc.

---

## 📝 Manual Testing Checklist

Print this checklist and mark as you test:

**Public Site:**
- [ ] Home page carousel works
- [ ] Navigation links work
- [ ] Reviews grid displays
- [ ] Search filters reviews
- [ ] Single review page loads
- [ ] Comment form works
- [ ] Reply to comment works
- [ ] Nested comments display
- [ ] Star ratings show correctly
- [ ] Tags are clickable
- [ ] Next/prev navigation works
- [ ] About page loads
- [ ] Footer displays
- [ ] Mobile responsive
- [ ] No console errors

**Admin Panel:**
- [ ] Login works
- [ ] Dashboard loads
- [ ] Create review form works
- [ ] ISBN fetch works
- [ ] Barcode scanner works (if tested)
- [ ] AI generation works
- [ ] Draft saves
- [ ] Publish works
- [ ] Edit review works
- [ ] Delete review works
- [ ] Logout works
- [ ] Protected routes redirect to login

**Performance:**
- [ ] Pages load quickly
- [ ] Images load properly
- [ ] No layout shift
- [ ] Smooth animations
- [ ] Works on slow connection

---

Happy testing! 🎉📚

