# 🚀 EmailJS Quick Setup Guide

## ✅ Current Status
EmailJS is already initialized successfully! You just need to add your credentials.

## 📋 Step-by-Step Setup

### 1. Get Your EmailJS Credentials

1. **Go to [EmailJS Dashboard](https://dashboard.emailjs.com/)**
2. **Get Service ID**: 
   - Go to "Email Services" → Copy your Service ID (looks like `service_xxxxxxx`)
3. **Get Template ID**:
   - Go to "Email Templates" → Copy your Template ID (looks like `template_xxxxxxx`)
4. **Get Public Key**:
   - Go to "Account" → Copy your Public Key (looks like `xxxxxxxxxxxxxxx`)

### 2. Create Environment File

**Create a file named `.env` in your project root** (same folder as `package.json`) with this content:

```bash
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_xxxxxxx
VITE_EMAILJS_TEMPLATE_ID=template_xxxxxxx
VITE_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxxxx
```

**Replace the values** with your actual credentials from step 1.

### 3. Restart Development Server

1. **Stop the server**: Press `Ctrl+C` in your terminal
2. **Start it again**: Run `npm run dev`

### 4. Test Email Functionality

1. **Go to Admin Dashboard** → Email Management
2. **Check status**: Should show "EmailJS is configured and ready to send emails"
3. **Send test email**: Use the "Send Email" tab
4. **Test event registration**: Register for an event to test automatic emails

## 🎯 Expected Results

After setup, you should see:
- ✅ No more EmailJS warnings in console
- ✅ "EmailJS configured" status in admin dashboard
- ✅ Real emails sent to your inbox
- ✅ Professional email templates

## 🚨 Troubleshooting

**If emails don't work:**
1. Check that your `.env` file is in the project root
2. Make sure environment variables start with `VITE_`
3. Restart the development server after creating `.env`
4. Check your spam folder for emails
5. Verify your EmailJS credentials are correct

**If you see Firebase errors:**
- These are separate from EmailJS and won't affect email functionality
- EmailJS works independently of Firebase

## 📧 Quick Test

Once you've added your credentials:
1. Go to Admin Dashboard → Email Management
2. Click "Send Email" tab
3. Fill in the form and send a test email
4. Check your inbox!

---

**Need help?** The EmailJS setup is working - you just need to add your credentials to the `.env` file!
