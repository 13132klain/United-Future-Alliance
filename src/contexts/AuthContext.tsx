import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup,
  sendPasswordResetEmail,
  signOut, 
  updateProfile,
  User as FirebaseUser
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider, isFirebaseConfigured } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Admin emails that get admin role
const ADMIN_EMAILS = ['admin@ufa.org', 'omondikeyvin@gmail.com'];

// Helper function to convert Firebase user to our User type
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  const isAdmin = ADMIN_EMAILS.includes(firebaseUser.email || '');
  
  return {
    id: firebaseUser.uid,
    name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
    email: firebaseUser.email || '',
    avatar: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User')}&background=10b981&color=fff`,
    role: isAdmin ? 'admin' : 'user'
  };
};

// Helper function to get user-friendly error messages
const getAuthErrorMessage = (errorCode: string): string => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address format.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/user-not-found':
      return 'No user found with this email.';
    case 'auth/wrong-password':
      return 'Incorrect password.';
    case 'auth/email-already-in-use':
      return 'This email is already registered.';
    case 'auth/operation-not-allowed':
      return 'Email/password accounts are not enabled.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection.';
    default:
      return 'An authentication error occurred. Please try again.';
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Listen to Firebase auth state changes
  useEffect(() => {
    if (!isFirebaseConfigured() || !auth) {
      console.log('Firebase not configured - using demo mode');
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          const userData = await convertFirebaseUser(firebaseUser);
          setUser(userData);
          
          // Save user data to Firestore (optional)
          if (db) {
            try {
              const userRef = doc(db, 'users', firebaseUser.uid);
              await setDoc(userRef, {
                uid: firebaseUser.uid,
                email: firebaseUser.email,
                displayName: firebaseUser.displayName,
                photoURL: firebaseUser.photoURL,
                role: userData.role,
                lastLogin: new Date().toISOString(),
                createdAt: firebaseUser.metadata.creationTime,
              }, { merge: true });
            } catch (dbError) {
              console.log('Could not save user to Firestore:', dbError);
            }
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('Error processing auth state change:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      if (!isFirebaseConfigured() || !auth) {
        // Demo mode - simulate successful login for demo purposes
        console.log('🔧 Demo mode: Simulating login for', email);
        const demoUser: User = {
          id: 'demo-user',
          email: email,
          name: email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'user',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email.split('@')[0])}&background=10b981&color=fff`,
          createdAt: new Date().toISOString()
        };
        setUser(demoUser);
        setLoading(false);
        return;
      }

      // Sign in with Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // User state will be updated by the onAuthStateChanged listener
      console.log('✅ User signed in successfully:', userCredential.user.email);
    } catch (error: any) {
      console.error('❌ Sign in error:', error);
      const errorMessage = getAuthErrorMessage(error.code) || 'Failed to sign in. Please try again.';
      setError(errorMessage);
      setLoading(false);
      // Don't throw the error to prevent uncaught promise rejection
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      if (!isFirebaseConfigured() || !auth) {
        // Demo mode - simulate successful signup for demo purposes
        console.log('🔧 Demo mode: Simulating signup for', email);
        const demoUser: User = {
          id: 'demo-user',
          email: email,
          name: name.trim(),
          role: email.includes('admin') ? 'admin' : 'user',
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=10b981&color=fff`,
          createdAt: new Date().toISOString()
        };
        setUser(demoUser);
        setLoading(false);
        return;
      }

      // Basic validation
      if (!name.trim()) {
        const errorMessage = 'Name is required';
        setError(errorMessage);
        setLoading(false);
        return;
      }

      if (!email.includes('@')) {
        const errorMessage = 'Please enter a valid email address';
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Create user with Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update the user's display name
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
        photoURL: `https://ui-avatars.com/api/?name=${encodeURIComponent(name.trim())}&background=10b981&color=fff`
      });

      // User state will be updated by the onAuthStateChanged listener
      console.log('✅ User created successfully:', userCredential.user.email);
    } catch (error: any) {
      console.error('❌ Sign up error:', error);
      const errorMessage = getAuthErrorMessage(error.code) || 'Failed to create account. Please try again.';
      setError(errorMessage);
      setLoading(false);
      // Don't throw the error to prevent uncaught promise rejection
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      if (!isFirebaseConfigured() || !auth) {
        // Demo mode - simulate successful Google signin for demo purposes
        console.log('🔧 Demo mode: Simulating Google signin');
        const demoUser: User = {
          id: 'demo-user',
          email: 'demo@ufa.org',
          name: 'Demo User',
          role: 'user',
          avatar: 'https://ui-avatars.com/api/?name=Demo+User&background=10b981&color=fff',
          createdAt: new Date().toISOString()
        };
        setUser(demoUser);
        setLoading(false);
        return;
      }

      // Sign in with Google popup
      const result = await signInWithPopup(auth, googleProvider);
      
      // User state will be updated by the onAuthStateChanged listener
      console.log('✅ Google sign-in successful:', result.user.email);
    } catch (error: any) {
      console.error('❌ Google sign-in error:', error);
      
      // Handle specific Google auth errors
      let errorMessage = 'Failed to sign in with Google. Please try again.';
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in was cancelled. Please try again.';
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = 'Popup was blocked by your browser. Please allow popups and try again.';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        errorMessage = 'An account already exists with this email using a different sign-in method.';
      } else if (error.code === 'auth/operation-not-allowed') {
        errorMessage = 'Google sign-in is not enabled. Please contact support.';
      }
      
      setError(errorMessage);
      setLoading(false);
      // Don't throw the error to prevent uncaught promise rejection
    }
  };

  const resetPassword = async (email: string): Promise<void> => {
    setError(null);
    setLoading(true);

    try {
      if (!isFirebaseConfigured() || !auth) {
        const errorMessage = 'Firebase authentication is not configured. Please check your setup.';
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Basic validation
      if (!email.includes('@')) {
        const errorMessage = 'Please enter a valid email address';
        setError(errorMessage);
        setLoading(false);
        return;
      }

      // Send password reset email
      await sendPasswordResetEmail(auth, email);
      
      console.log('✅ Password reset email sent to:', email);
    } catch (error: any) {
      console.error('❌ Password reset error:', error);
      
      // Handle specific password reset errors
      let errorMessage = 'Failed to send password reset email. Please try again.';
      
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many password reset attempts. Please try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your connection and try again.';
      }
      
      setError(errorMessage);
      setLoading(false);
      // Don't throw the error to prevent uncaught promise rejection
    }
  };

  const logout = async (): Promise<void> => {
    try {
      if (isFirebaseConfigured() && auth) {
        await signOut(auth);
        console.log('✅ User signed out successfully');
      } else {
        // Fallback for demo mode
        setUser(null);
      }
      setError(null);
    } catch (error: any) {
      console.error('❌ Logout error:', error);
      setError('Failed to sign out. Please try again.');
      throw new Error('Failed to sign out. Please try again.');
    }
  };

  const clearError = (): void => {
    setError(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signInWithGoogle,
    resetPassword,
    logout,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
