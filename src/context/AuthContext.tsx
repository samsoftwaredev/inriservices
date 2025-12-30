"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { createClient } from "@/app/supabaseConfig";
import { User } from "@supabase/supabase-js";
import { Profile, profileApi } from "@/services";
// Types
interface AuthContextType {
  user: User | null;
  userData?: Profile | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  // Sign up function
  const signup = async (
    email: string,
    password: string,
    displayName: string,
    companyId: string
  ): Promise<User> => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: displayName,
          company_id: companyId,
        },
      },
    });

    if (error) throw error;
    if (!data.user) throw new Error("No user returned from signup");

    return data.user;
  };

  // Login function
  const login = async (email: string, password: string): Promise<User> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error("No user returned from login");

    return data.user;
  };

  // Logout function
  const logout = async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  // Reset password function
  const resetPassword = async (email: string): Promise<void> => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  };

  // Update user profile function
  const updateUserProfile = async (displayName: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      data: { display_name: displayName },
    });
    if (error) throw error;

    // Force refresh the current user state
    if (user) {
      setUser({
        ...user,
        user_metadata: { ...user.user_metadata, display_name: displayName },
      });
    }
  };

  // Send verification email function
  const sendVerificationEmail = async (): Promise<void> => {
    if (user?.email) {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: user.email,
      });
      if (error) throw error;
    }
  };

  const fetchUserData = async (): Promise<void> => {
    try {
      const userData = await profileApi.getMe();
      setUserData(userData);
      console.log("Auth state changed. Current user:", userData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    }
  };

  // Set up auth state observer
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserData();
        } else {
          setUserData(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    userData,
    loading,
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    sendVerificationEmail,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
