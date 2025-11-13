# 🚀 Vercel Deployment Guide

## 🔴 Current Issues & Fixes

### Issue 1: MongoDB Connection Error (500)
**Problem:** MongoDB Atlas blocking Vercel's IP addresses

**Solution:** Whitelist all IPs in MongoDB Atlas

### Issue 2: Login Loading Forever
**Problem:** API routes timing out or failing silently

---

## ✅ Step-by-Step Fix

### 1. MongoDB Atlas IP Whitelist

1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Select your cluster
3. Click "Network Access" in left sidebar
4. Click "Add IP Address"
5. Click "Allow Access from Anywhere"
6. Enter IP: **0.0.0.0/0**
7. Click "Confirm"

**Why?** Vercel uses dynamic IPs, so we need to allow all IPs.

---

### 2. Update Environment Variables in Vercel

Go to your Vercel project → Settings → Environment Variables

Add these **exactly** (check for typos):

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/kayinbooks?retryWrites=true&w=majority

JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

ADMIN_EMAIL=admin@kayinbooks.com

ADMIN_PASSWORD=your-secure-password

HUGGINGFACE_API_TOKEN=hf_your_token_here

NEXT_PUBLIC_BASE_URL=https://kay-reads.vercel.app
```

**Important:**
- No quotes around values
- No trailing spaces
- Replace the actual MongoDB password (not literally "password")
- Make sure JWT_SECRET is long and random

---

### 3. Verify MongoDB URI Format

Your MongoDB URI should look like:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

**Common mistakes:**
- ❌ Password has special characters not URL-encoded
- ❌ Missing database name
- ❌ Wrong cluster name

**If password has special characters**, URL encode them:
- `@` → `%40`
- `#` → `%23`
- `$` → `%24`
- `&` → `%26`

---

---

## 🔍 Debug Your Deployment

### Check Health Endpoint

Visit: `https://kay-reads.vercel.app/api/health`

This will show you:
- ✅ Which environment variables are set
- ✅ MongoDB connection status
- ❌ Any errors

**What to look for:**
```json
{
  "status": "ok",
  "database": {
    "status": "connected"  // ← Should be "connected"
  },
  "environmentVariables": {
    "MONGODB_URI": true,   // ← All should be true
    "JWT_SECRET": true,
    ...
  }
}
```

---

## 🔧 After You Fix the Above

### Redeploy on Vercel

1. Go to your Vercel dashboard
2. Click on your project
3. Go to "Deployments" tab
4. Click "..." on the latest deployment
5. Click "Redeploy"

**OR** push a new commit:
```bash
git add .
git commit -m "Fix Vercel deployment"
git push
```

---

## ✅ Verification Checklist

After redeploying, check these:

1. **Health Check**
   - [ ] Visit `/api/health`
   - [ ] Database shows "connected"
   - [ ] All env vars show `true`

2. **Home Page**
   - [ ] Visit `https://kay-reads.vercel.app`
   - [ ] Reviews load (no 500 error)
   - [ ] Images display

3. **Admin Login**
   - [ ] Visit `/admin/login`
   - [ ] Can log in (not stuck loading)
   - [ ] Redirects to dashboard

4. **Create Admin User** (First time only)
   - Visit: `https://kay-reads.vercel.app/api/auth/init`
   - Should see success message

---

## 🆘 Still Having Issues?

### Check Vercel Logs

1. Go to Vercel Dashboard
2. Select your project
3. Click "Deployments"
4. Click on the latest deployment
5. Click "Functions" tab
6. Look for error messages

### Common Error Messages

**"MongoServerSelectionError"**
- ❌ IP not whitelisted in MongoDB Atlas
- ✅ Add 0.0.0.0/0 to Network Access

**"JWT_SECRET is required"**
- ❌ Environment variable not set
- ✅ Add JWT_SECRET in Vercel settings

**"MONGODB_URI is undefined"**
- ❌ Environment variable not set correctly
- ✅ Check for typos in variable name

**"Timeout" errors**
- ❌ MongoDB connection taking too long
- ✅ Check MongoDB Atlas is running
- ✅ Verify connection string is correct

---

## 📞 Need Help?

If you're still stuck, check:

1. MongoDB Atlas Network Access allows 0.0.0.0/0
2. All environment variables are set in Vercel (no typos!)
3. MONGODB_URI password is URL-encoded if it has special characters
4. Visit `/api/health` to see specific errors
5. Check Vercel function logs for detailed errors

---

## 🎯 Quick Fix Summary

1. ✅ MongoDB Atlas → Network Access → Allow 0.0.0.0/0
2. ✅ Vercel → Settings → Environment Variables → Add all from .env.local
3. ✅ Visit `/api/health` to verify
4. ✅ Redeploy on Vercel
5. ✅ Visit `/api/auth/init` to create admin user
6. ✅ Test login at `/admin/login`

**Your site should now work perfectly! 🚀**

