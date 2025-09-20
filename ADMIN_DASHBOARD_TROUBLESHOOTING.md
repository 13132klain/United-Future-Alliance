# 🔧 Admin Dashboard Troubleshooting Guide

## 🚨 **Problem: Blank Admin Dashboard Page**

If you're seeing a blank page when trying to access the admin dashboard, here are the most common causes and solutions:

## 🔍 **Step 1: Check Your Login Status**

### **Are you logged in?**
1. **Check the header** - Do you see your name/avatar in the top right?
2. **If not logged in**: Click "Sign In" and log in with your credentials

### **Are you using the correct admin email?**
The system recognizes these emails as admin:
- `admin@ufa.org`
- `omondikeyvin@gmail.com`

**If your email is not in this list**, you won't have admin access.

## 🔍 **Step 2: Check Browser Console for Errors**

1. **Open Developer Tools**: Press `F12` or right-click → "Inspect"
2. **Go to Console tab**
3. **Look for error messages** (red text)
4. **Common errors to look for**:
   - `Firebase not configured`
   - `Authentication errors`
   - `Network errors`
   - `JavaScript errors`

## 🔍 **Step 3: Verify Admin Access**

### **Method 1: Check User Menu**
1. **Log in** with an admin email
2. **Click your name/avatar** in the top right
3. **Look for "Admin Dashboard"** option in the dropdown
4. **If you don't see it**: Your email is not recognized as admin

### **Method 2: Direct URL Access**
1. **Log in** with an admin email
2. **Try navigating directly** to the admin dashboard
3. **You should see either**:
   - ✅ **Admin Dashboard** (if you have access)
   - ❌ **"Access Denied"** message (if you don't have access)

## 🔧 **Solutions**

### **Solution 1: Add Your Email to Admin List**

If your email is not recognized as admin, you need to add it to the admin list:

1. **Open the file**: `src/contexts/AuthContext.tsx`
2. **Find line 44**: `const ADMIN_EMAILS = ['admin@ufa.org', 'omondikeyvin@gmail.com'];`
3. **Add your email**: `const ADMIN_EMAILS = ['admin@ufa.org', 'omondikeyvin@gmail.com', 'your-email@gmail.com'];`
4. **Save the file**
5. **Restart your development server**
6. **Log out and log back in**

### **Solution 2: Use Demo Mode for Testing**

If Firebase is not configured, you can use demo mode:

1. **Log in with any email** that contains "admin" (e.g., `admin@test.com`)
2. **The system will automatically give you admin role** in demo mode
3. **You should see the admin dashboard**

### **Solution 3: Check Firebase Configuration**

If you're getting Firebase errors:

1. **Check your `.env` file** has the correct Firebase credentials
2. **Verify Firebase project** is set up correctly
3. **Check browser console** for specific Firebase errors
4. **Restart your development server** after making changes

## 🧪 **Testing Steps**

### **Test 1: Basic Access**
1. **Log in** with `omondikeyvin@gmail.com`
2. **Click your name** in the header
3. **Click "Admin Dashboard"**
4. **You should see the admin dashboard**

### **Test 2: Demo Mode**
1. **Log in** with `admin@test.com` (any email with "admin")
2. **You should automatically get admin access**
3. **Admin dashboard should be accessible**

### **Test 3: Direct Navigation**
1. **Log in** with an admin email
2. **Try to navigate** to admin dashboard
3. **Check for error messages** in console

## 🚨 **Common Error Messages**

### **"Access Denied - Please log in"**
- **Cause**: Not logged in
- **Solution**: Log in with your credentials

### **"Access Denied - You don't have admin privileges"**
- **Cause**: Your email is not in the admin list
- **Solution**: Add your email to `ADMIN_EMAILS` array

### **"Firebase not configured"**
- **Cause**: Firebase environment variables not set
- **Solution**: Set up Firebase or use demo mode

### **Blank page with no errors**
- **Cause**: JavaScript error or component issue
- **Solution**: Check browser console for errors

## 📋 **Quick Checklist**

- [ ] **Logged in** with correct credentials
- [ ] **Email is in admin list** (`omondikeyvin@gmail.com` or added to `ADMIN_EMAILS`)
- [ ] **No console errors** in browser
- [ ] **Development server** is running
- [ ] **Firebase configured** (or using demo mode)
- [ ] **Admin Dashboard option** appears in user menu

## 🎯 **Expected Behavior**

### **With Admin Access:**
1. **Log in** → See your name in header
2. **Click name** → See "Admin Dashboard" option
3. **Click "Admin Dashboard"** → See full admin interface
4. **Dashboard shows**: Overview, Events, News, Memberships, etc.

### **Without Admin Access:**
1. **Log in** → See your name in header
2. **Click name** → No "Admin Dashboard" option
3. **Try direct access** → See "Access Denied" message

---

**If you're still having issues, check the browser console for specific error messages and let me know what you see!** 🔍
