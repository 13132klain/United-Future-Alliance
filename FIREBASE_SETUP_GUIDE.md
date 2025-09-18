# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `ufa-website` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider:
   - Click on "Email/Password"
   - Toggle "Enable" to ON
   - Click "Save"

## Step 3: Get Firebase Configuration

1. Go to Project Settings (gear icon in left sidebar)
2. Scroll down to "Your apps" section
3. Click "Add app" and select the Web app icon (`</>`)
4. Register your app with a nickname (e.g., "UFA Website")
5. Copy the configuration object

## Step 4: Create Environment File

Create a file named `.env.local` in your project root with the following content:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key-here
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
VITE_FIREBASE_APP_ID=your-app-id
```

Replace the placeholder values with your actual Firebase configuration values.

## Step 5: Set Up Firestore (Optional)

If you want to store user data:

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

## Step 6: Configure Security Rules (Important!)

### Firestore Security Rules

Go to Firestore Database > Rules and update with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Public read access for events, news, etc.
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@ufa.org', 'yemblocreations@gmail.com'];
    }
    
    match /news/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@ufa.org', 'yemblocreations@gmail.com'];
    }
    
    match /leaders/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@ufa.org', 'yemblocreations@gmail.com'];
    }
    
    match /resources/{document} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email in ['admin@ufa.org', 'yemblocreations@gmail.com'];
    }
  }
}
```

## Step 7: Test Your Setup

1. Start your development server: `npm run dev`
2. Go to your app and try to register a new account
3. Check the Firebase Console > Authentication to see if the user was created
4. Try logging in with the created account

## Troubleshooting

### Common Issues:

1. **"Firebase not configured" error**: Check that your `.env.local` file exists and has the correct values
2. **Authentication not working**: Make sure Email/Password is enabled in Firebase Console
3. **Permission denied**: Check your Firestore security rules
4. **CORS errors**: Make sure your domain is added to Firebase authorized domains

### Getting Help:

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Auth Documentation](https://firebase.google.com/docs/auth)
- [Firestore Documentation](https://firebase.google.com/docs/firestore)
