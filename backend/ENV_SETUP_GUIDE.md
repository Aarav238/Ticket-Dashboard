# 🔧 Backend Environment Setup Guide

## 📝 Step-by-Step Configuration

### 1️⃣ **Database Configuration**

```env
DATABASE_URL=postgres://postgres.rbuwkdrnlfbrqvpdksyz:YOUR_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres
```

**How to get this:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **"Database"** in the left sidebar
4. Click **"Connection Pooling"** at the top
5. **Mode:** Transaction
6. **Copy** the connection string
7. Replace `[YOUR-PASSWORD]` with your actual database password
8. Use `postgres://` (NOT `postgresql://`)
9. Use port `6543` (pooler port)

**⚠️ Important:**
- Use the **Connection Pooling** URL (not Direct Connection)
- Use `postgres://` protocol
- Use port `6543` (pooler)
- Replace password with your actual Supabase password

---

### 2️⃣ **JWT Configuration**

```env
JWT_SECRET=your-super-secret-jwt-key-change-this
JWT_EXPIRES_IN=7d
```

**How to generate a secure JWT secret:**

**Option 1: Using Node.js**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Option 2: Using OpenSSL**
```bash
openssl rand -hex 32
```

**Option 3: Online Generator**
Visit: https://generate-secret.vercel.app/32

**Example output:**
```
a7f3c9e8b2d1f4a6c8e7b3d9f2a5c8e1b4d7f0a3c6e9b2d5f8a1c4e7b0d3f6a9
```

Copy this and use as your `JWT_SECRET`.

---

### 3️⃣ **Email Configuration (Gmail)**

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM="Ticket Dashboard" <your-email@gmail.com>
```

**📧 How to setup Gmail App Password:**

1. **Go to Google Account Settings**
   - Visit: https://myaccount.google.com/security

2. **Enable 2-Step Verification** (if not enabled)
   - Click "2-Step Verification"
   - Follow the setup process

3. **Create App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select app: **Mail**
   - Select device: **Other (Custom name)**
   - Type: **Ticket Dashboard**
   - Click **Generate**

4. **Copy the 16-character password**
   - Example: `abcd efgh ijkl mnop`
   - Remove spaces: `abcdefghijklmnop`
   - Use this as `EMAIL_PASSWORD`

**Example:**
```env
EMAIL_USER=myemail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM="Ticket Dashboard" <myemail@gmail.com>
```

**⚠️ Important:**
- You MUST use App Password (not your regular Gmail password)
- 2-Step Verification must be enabled
- Keep the password secret

---

### 4️⃣ **Super User Configuration**

```env
SUPER_USER_PASSWORD=Admin@123
```

**Change this to your own password!**

This password is used to enable "Super User" mode in the frontend, which allows:
- Assigning tickets to users
- Deleting tickets
- Access to elevated features

**Recommended format:**
- At least 8 characters
- Mix of uppercase, lowercase, numbers, symbols
- Example: `MySecure@Pass2024`

---

### 5️⃣ **Server Configuration**

```env
NODE_ENV=development
PORT=5000
```

**Settings:**
- `NODE_ENV`: Use `development` for local, `production` for deployment
- `PORT`: Backend server port (default: 5000)

---

## 📋 Complete `.env` Template

Create a file: `backend/.env`

```env
# ===================================
# DATABASE
# ===================================
DATABASE_URL=postgres://postgres.rbuwkdrnlfbrqvpdksyz:YOUR_ACTUAL_PASSWORD@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres

# ===================================
# JWT
# ===================================
JWT_SECRET=a7f3c9e8b2d1f4a6c8e7b3d9f2a5c8e1b4d7f0a3c6e9b2d5f8a1c4e7b0d3f6a9
JWT_EXPIRES_IN=7d

# ===================================
# EMAIL (Gmail)
# ===================================
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=myemail@gmail.com
EMAIL_PASSWORD=abcdefghijklmnop
EMAIL_FROM="Ticket Dashboard" <myemail@gmail.com>

# ===================================
# SUPER USER
# ===================================
SUPER_USER_PASSWORD=MySecure@Pass2024

# ===================================
# SERVER
# ===================================
NODE_ENV=development
PORT=5000
```

---

## ✅ Verification Checklist

Before running the backend, verify:

- [ ] **Database URL** is correct (pooler, port 6543, correct password)
- [ ] **JWT Secret** is a long random string (not the default)
- [ ] **Email credentials** are correct (using App Password)
- [ ] **2-Step Verification** is enabled on Gmail
- [ ] **Super User password** is changed from default
- [ ] **Port 5000** is available (or change if needed)

---

## 🚀 Test Your Configuration

### 1. Test Backend Startup
```bash
cd backend
npm run dev
```

**Expected output:**
```
✅ Database connected successfully
✅ Server running on port 5000
✅ Socket.io server initialized
```

### 2. Test Database Connection
Visit: http://localhost:5000/health

**Expected response:**
```json
{
  "status": "ok",
  "timestamp": "2024-10-07T..."
}
```

### 3. Test OTP Email
1. Start frontend: `cd frontend && npm run dev`
2. Open: http://localhost:3000
3. Enter your email
4. Click "Send OTP"
5. **Check your email inbox** for the OTP code

**If email doesn't arrive:**
- Check spam folder
- Verify Gmail App Password is correct
- Check backend logs for errors

---

## 🐛 Common Issues & Solutions

### Issue 1: "Database connection failed"
**Causes:**
- Wrong password in DATABASE_URL
- Using `postgresql://` instead of `postgres://`
- Using wrong port (should be 6543 for pooler)
- Database paused (Supabase free tier)

**Solution:**
```bash
# Check your Supabase dashboard
# Verify password is correct
# Use connection pooling URL with port 6543
DATABASE_URL=postgres://postgres.xxx:PASSWORD@xxx.pooler.supabase.com:6543/postgres
```

### Issue 2: "Invalid login credentials" (database)
**Solution:**
1. Go to Supabase Dashboard
2. Settings → Database
3. Click "Reset Database Password"
4. Copy new password
5. Update `.env` file

### Issue 3: "Email sending failed"
**Causes:**
- Not using App Password
- 2-Step Verification not enabled
- Wrong email/password

**Solution:**
1. Enable 2-Step Verification
2. Generate new App Password
3. Use the 16-character password (no spaces)
4. Update `EMAIL_PASSWORD` in `.env`

### Issue 4: "JWT secret too short"
**Solution:**
Generate a proper secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Issue 5: "Port 5000 already in use"
**Solution:**
Change port in `.env`:
```env
PORT=5001
```
And update frontend `.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5001
```

---

## 🔒 Security Best Practices

### For Development:
✅ Use `.env` file (never commit it!)  
✅ Add `.env` to `.gitignore`  
✅ Use App Password for Gmail  
✅ Keep JWT secret complex  

### For Production:
✅ Use environment variables (not .env file)  
✅ Generate new JWT secret  
✅ Use production database  
✅ Change super user password  
✅ Set `NODE_ENV=production`  
✅ Use HTTPS for all connections  
✅ Enable rate limiting  
✅ Monitor logs  

---

## 📚 Additional Resources

- [Supabase Connection Pooling](https://supabase.com/docs/guides/database/connecting-to-postgres#connection-pooler)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
- [Node.js Environment Variables](https://nodejs.org/en/learn/command-line/how-to-read-environment-variables-from-nodejs)

---

## ✨ You're All Set!

Once your `.env` is configured, run:

```bash
cd backend
npm run dev
```

Then test by accessing http://localhost:5000 🚀

**Need help?** Check the `SUPABASE_SETUP_GUIDE.md` for database setup!

