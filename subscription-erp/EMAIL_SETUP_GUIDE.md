# 📧 Email Configuration Guide - Resend Setup

## Overview
To send actual emails for password reset, you need to configure the Resend email service with a real API key.

---

## 🚀 Quick Setup (5 Minutes)

### Step 1: Create Resend Account
1. Go to **https://resend.com**
2. Click **"Sign Up"** (top right)
3. Sign up with your email or GitHub account
4. Verify your email address

### Step 2: Get Your API Key
1. After logging in, go to **API Keys** section
2. Click **"Create API Key"**
3. Give it a name (e.g., "SubsERP Development")
4. Select permissions: **"Sending access"**
5. Click **"Create"**
6. **Copy the API key** (it starts with `re_`)
   - ⚠️ **Important**: You can only see this once!

### Step 3: Add API Key to Your Project
1. Open `.env` file in your project root
2. Replace the placeholder with your real API key:

**Before:**
```env
RESEND_API_KEY=re_your_api_key_here
```

**After:**
```env
RESEND_API_KEY=re_abc123xyz456...  # Your actual API key
```

3. Save the file

### Step 4: Restart Dev Server
1. Stop the dev server (Ctrl+C in terminal)
2. Start it again: `npm run dev`
3. Wait for it to be ready

### Step 5: Test Email Sending
1. Go to `localhost:3000/forgot-password`
2. Enter your email: `aswatram2006@gmail.com`
3. Click "Send Reset Link"
4. **Check your email inbox!** 📧

---

## 📧 Resend Free Tier

### What You Get (FREE):
- ✅ **100 emails per day**
- ✅ **Unlimited API keys**
- ✅ **Email analytics**
- ✅ **No credit card required**

### Perfect For:
- Development
- Testing
- Small projects
- Personal use

---

## 🎨 Email Template

Your password reset emails will look like this:

```
┌─────────────────────────────────────┐
│  🔐 SubsERP                         │
│                                     │
│  Password Reset Request             │
│                                     │
│  Hello,                             │
│                                     │
│  We received a request to reset    │
│  your password...                   │
│                                     │
│  ┌───────────────────┐             │
│  │  Reset Password   │  (Button)   │
│  └───────────────────┘             │
│                                     │
│  Or copy this link:                 │
│  http://localhost:3000/reset-...   │
│                                     │
│  ⚠️ This link expires in 1 hour    │
│                                     │
│  © 2026 SubsERP                     │
└─────────────────────────────────────┘
```

---

## 🔧 Configuration Details

### Environment Variables (.env)
```env
# Database
DATABASE_URL="file:./dev.db"

# Email Configuration (Resend)
RESEND_API_KEY=re_your_actual_api_key_here

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Email Settings (app/lib/email.ts)
- **From**: `SubsERP <onboarding@resend.dev>`
- **Subject**: `Password Reset Request - SubsERP`
- **Template**: Beautiful HTML email with gradient design
- **Link Expiry**: 1 hour

---

## ✅ Verification Steps

### After Adding API Key:

1. **Check Environment Variable**
   ```bash
   # In terminal
   echo $env:RESEND_API_KEY  # Windows PowerShell
   # Should show your API key
   ```

2. **Test Email Sending**
   - Go to forgot password page
   - Enter your email
   - Click send
   - Check inbox (and spam folder)

3. **Check Server Console**
   - Look for success message:
   ```
   ✅ Email sent successfully
   ```
   - Or error message if something's wrong

---

## 🐛 Troubleshooting

### Issue: "Email service not configured"
**Solution**: API key is missing or invalid
- Check `.env` file has real API key
- Restart dev server
- Verify API key starts with `re_`

### Issue: "Failed to send email"
**Solution**: Check Resend dashboard
- Go to https://resend.com/logs
- See delivery status
- Check for errors

### Issue: "Email not received"
**Solution**: Check spam folder
- Gmail: Check "Spam" folder
- Outlook: Check "Junk" folder
- Wait 1-2 minutes for delivery

### Issue: "Invalid API key"
**Solution**: Generate new key
- Go to Resend dashboard
- Create new API key
- Update `.env` file
- Restart server

---

## 📝 Step-by-Step Email Setup

### 1. Sign Up for Resend
```
https://resend.com
↓
Click "Sign Up"
↓
Enter email or use GitHub
↓
Verify email
↓
Login to dashboard
```

### 2. Create API Key
```
Dashboard
↓
API Keys (left sidebar)
↓
"Create API Key" button
↓
Name: "SubsERP Development"
↓
Permission: "Sending access"
↓
Click "Create"
↓
Copy the key (starts with re_)
```

### 3. Update .env File
```
Open: .env file
↓
Find: RESEND_API_KEY=re_your_api_key_here
↓
Replace with: RESEND_API_KEY=re_abc123...
↓
Save file
```

### 4. Restart Server
```
Terminal with npm run dev
↓
Press Ctrl+C
↓
Run: npm run dev
↓
Wait for "Ready"
```

### 5. Test Email
```
Browser: localhost:3000/forgot-password
↓
Enter: aswatram2006@gmail.com
↓
Click: "Send Reset Link"
↓
Check: Email inbox
↓
Success! 🎉
```

---

## 🎯 What Happens After Setup

### User Experience:
1. User enters email on forgot password page
2. Clicks "Send Reset Link"
3. **Receives beautiful email** within seconds
4. Opens email
5. Clicks "Reset Password" button
6. Goes to reset password page
7. Enters new password
8. Password is updated
9. Can login with new password

### Email Delivery:
- **Speed**: 1-5 seconds
- **Reliability**: 99.9% delivery rate
- **Tracking**: View in Resend dashboard
- **Analytics**: Open rates, click rates

---

## 💡 Pro Tips

### Development:
- Use your personal email for testing
- Check spam folder first time
- Mark as "Not Spam" to train filter

### Production:
- Use custom domain (e.g., noreply@yourdomain.com)
- Verify domain in Resend
- Monitor email logs
- Set up webhooks for tracking

### Security:
- Never commit API key to Git
- Use environment variables
- Rotate keys periodically
- Monitor usage in dashboard

---

## 📊 Resend Dashboard

### What You Can See:
- **Email Logs**: All sent emails
- **Delivery Status**: Delivered, bounced, failed
- **Analytics**: Open rates, click rates
- **API Usage**: Daily/monthly limits
- **Domain Settings**: Custom domains

### Access:
https://resend.com/logs

---

## 🔗 Useful Links

- **Resend Website**: https://resend.com
- **Documentation**: https://resend.com/docs
- **API Keys**: https://resend.com/api-keys
- **Email Logs**: https://resend.com/logs
- **Pricing**: https://resend.com/pricing (Free tier available)

---

## ✅ Checklist

Before testing email:
- [ ] Created Resend account
- [ ] Generated API key
- [ ] Copied API key
- [ ] Updated `.env` file
- [ ] Saved `.env` file
- [ ] Restarted dev server
- [ ] Server shows "Ready"

Testing email:
- [ ] Opened forgot password page
- [ ] Entered valid email
- [ ] Clicked "Send Reset Link"
- [ ] Saw success message
- [ ] Checked email inbox
- [ ] Checked spam folder
- [ ] Received email
- [ ] Clicked reset link
- [ ] Reset password successfully

---

## 🎉 Success Indicators

You'll know it's working when:
- ✅ No error in browser console
- ✅ Success message appears
- ✅ Console shows "✅ Email sent successfully"
- ✅ Email appears in inbox within 5 seconds
- ✅ Email has beautiful design
- ✅ Reset link works

---

## 📧 Alternative: Gmail SMTP (Not Recommended)

If you prefer Gmail instead of Resend:
- More complex setup
- Less reliable
- Security concerns
- Not recommended for production

**Stick with Resend** - it's easier and better!

---

## 🚀 Quick Start Command

```bash
# 1. Get API key from https://resend.com
# 2. Update .env file
# 3. Restart server
npm run dev
# 4. Test at localhost:3000/forgot-password
```

---

**Once you add your Resend API key, emails will be sent automatically!** 📧✨

**Get your free API key now: https://resend.com** 🚀
