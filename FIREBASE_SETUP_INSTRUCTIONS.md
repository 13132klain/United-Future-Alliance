# 🔥 Firebase Setup Instructions

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `ufa-website` (or your preferred name)
4. Enable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Firestore Database

1. In your Firebase project, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll update rules later)
4. Select a location (choose closest to your users)
5. Click "Done"

## Step 3: Enable Authentication

1. Go to "Authentication" in your Firebase project
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" and "Google" providers
5. For Google, add your domain to authorized domains

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click "Web app" icon (</>) to add a web app
4. Enter app name: `UFA Website`
5. Click "Register app"
6. Copy the Firebase configuration object

## Step 5: Create Environment File

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

## Step 6: Update Firestore Rules

1. Go to "Firestore Database" > "Rules" tab
2. Replace the default rules with the content from `firestore.rules` file in this project
3. Click "Publish"

## Step 7: Test Connection

1. Start your development server: `npm run dev`
2. Open browser console to see Firebase connection status
3. You should see: "✅ Firebase initialized successfully"

## Step 8: Add Admin Users

1. Go to "Authentication" > "Users" tab
2. Add your admin email addresses
3. Update the admin emails in `firestore.rules` if needed

## Troubleshooting

### Common Issues:

1. **"Firebase not configured"** - Check your `.env.local` file exists and has correct values
2. **"Permission denied"** - Check Firestore rules and ensure you're authenticated as admin
3. **"Network error"** - Check your internet connection and Firebase project status

### Testing Firebase Connection:

```javascript
// Open browser console and run:
console.log('Firebase configured:', window.firebase?.app);
```

## Next Steps

Once Firebase is connected:
- Events, news, and leaders will be stored in Firestore
- Data will persist across browser sessions
- Real-time updates will work automatically
- Admin dashboard will have full CRUD functionality

