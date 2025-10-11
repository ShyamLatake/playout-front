import { auth } from '../config/firebase';
import { User as FirebaseUser } from 'firebase/auth';

/**
 * Get the current Firebase user's ID token
 */
export const getCurrentUserToken = async (): Promise<string | null> => {
  const user = auth.currentUser;
  if (user) {
    try {
      return await user.getIdToken();
    } catch (error) {
      console.error('Error getting Firebase ID token:', error);
      return null;
    }
  }
  return null;
};

/**
 * Get the current Firebase user's UID
 */
export const getCurrentUserUID = (): string | null => {
  const user = auth.currentUser;
  return user ? user.uid : null;
};

/**
 * Get Firebase user information for registration
 */
export const getFirebaseUserInfo = (firebaseUser: FirebaseUser) => {
  return {
    firebaseId: firebaseUser.uid,
    email: firebaseUser.email,
    emailVerified: firebaseUser.emailVerified,
    createdAt: firebaseUser.metadata.creationTime,
    lastSignIn: firebaseUser.metadata.lastSignInTime,
  };
};

/**
 * Validate Firebase ID token
 */
export const validateFirebaseToken = async (token: string): Promise<boolean> => {
  try {
    // This is a basic validation - in a real app, you might want to verify with Firebase Admin SDK
    return token && token.length > 0;
  } catch (error) {
    console.error('Error validating Firebase token:', error);
    return false;
  }
};