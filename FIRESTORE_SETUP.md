# Firestore Security Rules Setup Guide

## 🔐 Security Rules for UFA Admin Dashboard

This guide will help you set up Firestore security rules to allow admin users to manage events, news, and leaders.

## 📋 Quick Setup (Testing Mode)

### Step 1: Use Testing Rules (Temporary)
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Go to **Firestore Database** → **Rules**
4. Replace the existing rules with the content from `firestore-testing.rules`
5. Click **Publish**

⚠️ **Warning**: These rules allow anyone to access your database. Only use for testing!

## 🛡️ Production Setup (Secure)

### Step 1: Set Up Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. Enable **Google** authentication (optional)

### Step 2: Add Admin Users
1. Go to **Authentication** → **Users**
2. Add admin users with these emails:
   - `admin@ufa.org`
   - `yemblocreations@gmail.com`
   - Any email ending with `@ufa.org`

### Step 3: Deploy Secure Rules
1. Go to **Firestore Database** → **Rules**
2. Replace the rules with the content from `firestore.rules`
3. Click **Publish**

## 📁 Rule Structure

### Events Collection (`/events/{eventId}`)
- ✅ **Public Read**: Anyone can view events
- 🔒 **Admin Write**: Only admins can create/update/delete events

### News Collection (`/news/{newsId}`)
- ✅ **Public Read**: Anyone can view news articles
- 🔒 **Admin Write**: Only admins can create/update/delete news

### Leaders Collection (`/leaders/{leaderId}`)
- ✅ **Public Read**: Anyone can view leader profiles
- 🔒 **Admin Write**: Only admins can create/update/delete leaders

### Users Collection (`/users/{userId}`)
- 🔒 **User Access**: Users can only access their own data
- 🔒 **Admin Access**: Admins can read all user data

## 🔧 Environment Variables

Create a `.env.local` file in your project root:

```env
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

## 🧪 Testing the Rules

### Test Admin Access
1. Login with an admin email (`admin@ufa.org` or `yemblocreations@gmail.com`)
2. Try to add/edit/delete events, news, and leaders
3. Should work without permission errors

### Test Public Access
1. Login with a non-admin email
2. Should be able to read events, news, and leaders
3. Should NOT be able to create/edit/delete content

## 🚨 Troubleshooting

### "Missing or insufficient permissions" Error
1. Check if you're logged in with an admin email
2. Verify the email is in the admin list in the rules
3. Make sure Firestore rules are published
4. Check browser console for detailed error messages

### Rules Not Working
1. Ensure rules are published (not just saved)
2. Wait a few minutes for rules to propagate
3. Check Firebase Console for rule validation errors
4. Verify your Firebase project ID matches your environment variables

## 📚 Rule Explanations

### Admin Check Function
```javascript
function isAdmin() {
  return isAuthenticated() && 
         (request.auth.token.email in ['admin@ufa.org', 'yemblocreations@gmail.com'] ||
          request.auth.token.email.matches('.*@ufa\\.org$'));
}
```
This function checks if the user is:
- Authenticated (logged in)
- Has an admin email address
- OR has an email ending with `@ufa.org`

### Public Read Access
```javascript
allow read: if true;
```
This allows anyone (even non-authenticated users) to read the data.

### Admin Write Access
```javascript
allow create, update, delete: if isAdmin();
```
This only allows admin users to create, update, or delete data.

## 🔄 Switching Between Rules

### For Testing (Open Access)
Use `firestore-testing.rules` - allows all access

### For Production (Secure)
Use `firestore.rules` - admin-only write access

## 📞 Support

If you encounter issues:
1. Check the Firebase Console for error messages
2. Verify your environment variables are correct
3. Ensure you're logged in with an admin email
4. Check that Firestore is enabled in your Firebase project

