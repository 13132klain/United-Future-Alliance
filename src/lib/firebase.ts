import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
const isFirebaseConfigured = () => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.authDomain &&
    firebaseConfig.projectId &&
    firebaseConfig.storageBucket &&
    firebaseConfig.messagingSenderId &&
    firebaseConfig.appId
  );
};

// Initialize Firebase
let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;
let firebaseInitialized = false;

if (isFirebaseConfigured()) {
  try {
    // Initialize Firebase app
    app = initializeApp(firebaseConfig);
    
    // Initialize Firebase services
    auth = getAuth(app);
    db = getFirestore(app);
    storage = getStorage(app);
    
    firebaseInitialized = true;

    // Connect to emulators in development (optional)
    if (import.meta.env.DEV && import.meta.env.VITE_USE_FIREBASE_EMULATOR === 'true') {
      try {
        // Auth emulator
        if (!auth._delegate._config?.emulator) {
          connectAuthEmulator(auth, 'http://localhost:9099');
        }
        
        // Firestore emulator
        if (!db._delegate._settings?.host?.includes('localhost')) {
          connectFirestoreEmulator(db, 'localhost', 8080);
        }
        
        // Storage emulator
        if (!storage._delegate._host?.includes('localhost')) {
          connectStorageEmulator(storage, 'localhost', 9199);
        }
        
        console.log('🔥 Connected to Firebase emulators');
      } catch (emulatorError) {
        console.log('⚠️ Firebase emulators not available, using production');
      }
    }

    console.log('✅ Firebase initialized successfully');
    console.log('📊 Firebase Config:', {
      projectId: firebaseConfig.projectId,
      authDomain: firebaseConfig.authDomain,
      apiKey: firebaseConfig.apiKey?.substring(0, 10) + '...',
    });
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
    console.log('🔄 Falling back to mock services due to Firebase initialization failure');
    firebaseInitialized = false;
    db = null;
    auth = null;
    storage = null;
  }
} else {
  console.log('⚠️ Firebase not configured - check your environment variables');
  console.log('📋 Required environment variables:', [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN', 
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ]);
}

// Create Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

// Export Firebase services
export { app, auth, db, storage, googleProvider, isFirebaseConfigured, firebaseInitialized };

// Export Firebase types for convenience
export type { User as FirebaseUser } from 'firebase/auth';
export type { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
