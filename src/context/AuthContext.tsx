"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  confirmPasswordReset,
  onAuthStateChanged,
  updateProfile,
  sendEmailVerification,
} from "firebase/auth";
import { auth } from "@/app/firebaseConfig";
import { AppUser, userApi } from "@/services";

// Types
interface AuthContextType {
  firebaseUser: User | null;
  userData?: AppUser | null;
  loading: boolean;
  // Auth methods
  signup: (
    email: string,
    password: string,
    displayName: string,
    companyId: string
  ) => Promise<User>;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  confirmPasswordReset: (oobCode: string, newPassword: string) => Promise<void>;
  updateUserProfile: (displayName: string) => Promise<void>;
  sendVerificationEmail: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Auth Provider component
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (
    email: string,
    password: string,
    displayName: string,
    companyId: string
  ): Promise<User> => {
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile with display name if provided
      await updateProfile(result.user, {
        displayName: displayName,
      });

      const [firstName, ...lastName] = displayName.split(" ");

      await userApi.createUser(result.user.uid, {
        email: result.user.email || "",
        companyId: companyId,
        role: "company_user",
        firstName: firstName,
        lastName: lastName.join(" "),
        phone: "",
        status: "active",
      });

      // Send email verification
      if (result.user) {
        await sendEmailVerification(result.user);
      }

      return result.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result.user;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Confirm password reset function
  const confirmPasswordResetFunction = async (
    oobCode: string,
    newPassword: string
  ): Promise<void> => {
    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Update user profile function
  const updateUserProfile = async (displayName: string): Promise<void> => {
    try {
      if (firebaseUser) {
        await updateProfile(firebaseUser, { displayName });
        // Force refresh the current user state
        setFirebaseUser({ ...firebaseUser, displayName });
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Send verification email function
  const sendVerificationEmail = async (): Promise<void> => {
    try {
      if (firebaseUser) {
        await sendEmailVerification(firebaseUser);
      }
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  const fetchUserData = async (uid: string) => {
    try {
      const userData = await userApi.getUser(uid);
      setUserData(userData);
      console.log("Auth state changed. Current user:", userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // Set up auth state observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setFirebaseUser(user);
      if (user) {
        await fetchUserData(user.uid);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    firebaseUser,
    userData,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    confirmPasswordReset: confirmPasswordResetFunction,
    updateUserProfile,
    sendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
