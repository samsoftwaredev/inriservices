"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/app/supabaseConfig";
import { AuthResponse, User } from "@supabase/supabase-js";
// Types
interface AuthContextType {
  userData?: User | null;
  loading: boolean;
  // Auth methods
  signup: (
    email: string,
    password: string,
    displayName: string,
    companyId: string
  ) => Promise<AuthResponse>;
  login: (email: string, password: string) => Promise<AuthResponse>;
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
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const supabase = createClient();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (
    email: string,
    password: string,
    displayName: string,
    companyId: string
  ): Promise<AuthResponse> => {
    try {
      const data = {
        email: email,
        password: password,
      };

      const result = await supabase.auth.signUp(data);

      if (result.error) {
        throw new Error(result.error.message);
      }

      const [firstName, ...lastName] = displayName.split(" ");

      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Login function
  const login = async (
    email: string,
    password: string
  ): Promise<AuthResponse> => {
    try {
      const result = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });
      if (result.error) {
        throw new Error(result.error.message);
      }
      return result;
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Logout function
  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
    } catch (error: any) {
      throw new Error(error.message);
    }
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {};

  // Confirm password reset function
  const confirmPasswordResetFunction = async (
    oobCode: string,
    newPassword: string
  ): Promise<void> => {};

  // Update user profile function
  const updateUserProfile = async (displayName: string): Promise<void> => {};

  // Send verification email function
  const sendVerificationEmail = async (): Promise<void> => {};

  const fetchUserData = async (uid: string) => {};

  // Set up auth state observer
  useEffect(() => {
    fetchUserData("123");
  }, []);

  const value: AuthContextType = {
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
