# 🎨 Frontend Environment Setup Guide

## 📝 Simple Setup (2 Variables Only!)

The frontend only needs **2 environment variables** pointing to your backend!

---

## 📋 `.env.local` Configuration

Create a file: `frontend/.env.local`

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000

# Backend Socket.io URL
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**That's it!** ✅

---

## 🔧 Configuration Guide

### For Local Development

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

**Use when:**
- Running backend locally on port 5000
- Developing on your local machine

---

### For Production (After Deployment)

```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
```

**Use when:**
- Backend is deployed to Railway/Render
- Frontend is deployed to Vercel
- Replace with your actual backend URL

---

## 📖 Variable Descriptions

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend REST API endpoint | `http://localhost:5000` |
| `NEXT_PUBLIC_SOCKET_URL` | Backend WebSocket endpoint | `http://localhost:5000` |

**Note:** Both variables point to the same backend URL since Socket.io runs on the same server as the API.

---

## 🚀 Quick Setup Commands

### Option 1: Create Manually
```bash
cd frontend
nano .env.local
```

Then paste:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Option 2: Create Automatically
```bash
cd frontend
cat > .env.local << 'EOF'
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
EOF
```

---

## ✅ Verification

### 1. Check if file exists
```bash
cd frontend
cat .env.local
```

**Expected output:**
```
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### 2. Start the frontend
```bash
npm run dev
```

**Expected output:**
```
▲ Next.js 15.5.4
- Local:        http://localhost:3000
✓ Starting...
✓ Ready in 2s
```

### 3. Test in Browser
1. Open http://localhost:3000
2. You should see the login page
3. Check browser console (F12) - no errors about API connection

---

## 🐛 Troubleshooting

### Issue 1: "Failed to connect to backend"

**Check:**
```bash
# Is backend running?
curl http://localhost:5000/health
```

**Should return:**
```json
{"status":"ok"}
```

**If not working:**
- Start backend: `cd backend && npm run dev`
- Check backend is on port 5000
- Verify `.env.local` URLs are correct

---

### Issue 2: "Socket.io connection failed"

**Browser Console Error:**
```
WebSocket connection to 'ws://localhost:5000/' failed
```

**Solution:**
1. Ensure backend is running
2. Check `NEXT_PUBLIC_SOCKET_URL` is correct
3. Verify backend Socket.io is initialized

---

### Issue 3: "Environment variables not loading"

**Common causes:**
- File named wrong (must be `.env.local`, not `.env`)
- File in wrong directory (must be in `frontend/`)
- Need to restart Next.js dev server

**Solution:**
```bash
# Stop the dev server (Ctrl+C)
# Restart it
npm run dev
```

---

## 🔄 Different Port Configuration

### If Backend Uses Different Port

If your backend runs on a different port (e.g., 3001, 8000):

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

**Update both variables to match your backend port!**

---

## 🌐 Production Deployment

### When Deploying to Vercel

1. **Push code to GitHub** (don't commit `.env.local`!)

2. **In Vercel Dashboard:**
   - Go to your project
   - Settings → Environment Variables
   - Add:
     ```
     NEXT_PUBLIC_API_URL = https://your-backend.railway.app
     NEXT_PUBLIC_SOCKET_URL = https://your-backend.railway.app
     ```

3. **Redeploy** (Vercel will auto-redeploy with new env vars)

---

## 🔒 Security Notes

### ✅ Safe to Expose
- These variables start with `NEXT_PUBLIC_`
- They are **publicly visible** in the browser
- This is expected and safe!
- They only contain your backend URL

### ⚠️ Never Put These in Frontend `.env.local`:
- ❌ Database credentials
- ❌ JWT secrets
- ❌ API keys
- ❌ Email passwords
- ❌ Any sensitive data

**All sensitive data goes in the backend `.env` file!**

---

## 📊 Complete Setup Checklist

- [ ] Created `frontend/.env.local` file
- [ ] Added `NEXT_PUBLIC_API_URL`
- [ ] Added `NEXT_PUBLIC_SOCKET_URL`
- [ ] Both variables point to `http://localhost:5000`
- [ ] Backend is running on port 5000
- [ ] Frontend dev server restarted
- [ ] Can access http://localhost:3000
- [ ] Login page loads without errors

---

## 🎯 Quick Reference

### Local Development
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SOCKET_URL=http://localhost:5000
```

### Production
```env
NEXT_PUBLIC_API_URL=https://your-backend.railway.app
NEXT_PUBLIC_SOCKET_URL=https://your-backend.railway.app
```

### Custom Port (e.g., 3001)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

---

## ✨ You're Done!

Frontend environment setup is complete! 

**Next steps:**
1. Make sure backend is running: `cd backend && npm run dev`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:3000
4. Start building! 🚀

---

**Need help?** Check `backend/ENV_SETUP_GUIDE.md` for backend configuration!

