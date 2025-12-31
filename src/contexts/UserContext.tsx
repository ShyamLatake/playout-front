import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserType } from '../types';
import { auth } from '../config/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { apiService } from '../services/api';
import { getFirebaseUserInfo } from '../utils/firebase';
import { getUserType } from '../utils/userUtils';

interface UserContextType {
  user: User | null;
  login: (email: string, password: string, userType?: UserType) => Promise<User>;
  logout: () => void;
  register: (userData: Partial<User> & { password: string; userType: UserType }) => Promise<User>;
  switchUserType: (userType: UserType) => void;
  refreshProfile: () => Promise<void>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get user data from backend using login endpoint
          // This will auto-register if user doesn't exist
          const idToken = await firebaseUser.getIdToken();
          const response = await apiService.login(idToken) as any;
          const userData = response.data?.user;
          // Map roles to userType for backward compatibility
          if (userData && !userData.userType && userData.roles) {
            userData.userType = getUserType(userData);
          }
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, _userType?: UserType) => {
    setIsLoading(true);
    try {
      // Firebase login
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      // Send token to backend for verification and user data
      const response = await apiService.login(idToken) as any;
      const userData = response.data?.user;
      // Map roles to userType for backward compatibility
      if (userData && !userData.userType && userData.roles) {
        userData.userType = getUserType(userData);
      }
      setUser(userData);
      
      // Return user data for redirect logic
      return userData;
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      // Silent error handling
    }
  };

  const register = async (userData: Partial<User> & { password: string; userType: UserType }) => {
    setIsLoading(true);
    try {
      const { password, ...registrationData } = userData;
      
      // Create Firebase user
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email!, password);
      const firebaseUser = userCredential.user;
      
      // Get Firebase ID token
      const idToken = await firebaseUser.getIdToken();
      
      // Get Firebase user information
      const firebaseInfo = getFirebaseUserInfo(firebaseUser);
      
      // Prepare registration data with Firebase UID and additional info
      const registrationPayload = {
        ...registrationData,
        ...firebaseInfo,
        idToken: idToken
      };
      

      
      // Register with backend
      const response = await apiService.register(registrationPayload) as any;
      const newUser = response.data?.user;
      // Map roles to userType for backward compatibility
      if (newUser && !newUser.userType && newUser.roles) {
        newUser.userType = getUserType(newUser);
      }
      setUser(newUser);
      
      // Return user data for redirect logic
      return newUser;
    } catch (error) {
      
      // If Firebase user was created but backend registration failed,
      // we should clean up the Firebase user
      if (auth.currentUser) {
        try {
          await auth.currentUser.delete();
        } catch (cleanupError) {
          // Silent cleanup failure
        }
      }
      
      throw new Error('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const switchUserType = async (userType: UserType) => {
    if (!user) return;
    
    try {
      // Note: userType is deprecated in favor of roles
      // This is kept for backward compatibility
      // In the future, use role assignment endpoints instead
      const response = await apiService.updateProfile({ userType }) as any;
      setUser(response.data?.user);
    } catch (error) {
      throw new Error('Failed to switch user type');
    }
  };

  // Helper function to refresh user profile
  const refreshProfile = async () => {
    if (!auth.currentUser) return;
    
    try {
      const idToken = await auth.currentUser.getIdToken();
      const response = await apiService.login(idToken) as any;
      const userData = response.data?.user;
      // Map roles to userType for backward compatibility
      if (userData && !userData.userType && userData.roles) {
        userData.userType = getUserType(userData);
      }
      setUser(userData);
    } catch (error) {
      console.error('Error refreshing profile:', error);
    }
  };

  const value: UserContextType = {
    user,
    login,
    logout,
    register,
    switchUserType,
    refreshProfile,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};