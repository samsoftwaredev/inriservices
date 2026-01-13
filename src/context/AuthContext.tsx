"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { supabase } from "@/app/supabaseConfig";
import { Session, User } from "@supabase/supabase-js";
import { profileApi } from "@/services";
import { UserProfile } from "@/types";

interface AuthContextType {
  user: User | null;
  userData?: UserProfile | null;
  loading: boolean;
  authError: string | null;
  authSuccess: boolean;
  session: Session | null;
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
  confirmPasswordReset: (newPassword: string) => Promise<void>;
  checkUserIsLoggedIn: (callback: () => void) => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  // auth state
  const [session, setSession] = useState<Session | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authSuccess, setAuthSuccess] = useState(false);
  // Check URL params on initial render

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
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + "/auth/reset-password",
    });
    if (error) throw error;
  };

  const confirmPasswordReset = async (newPassword: string): Promise<void> => {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
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
      const translatedUserData = {
        fullName: userData.full_name!,
        companyId: userData.company_id!,
        id: userData.id!,
        createdAt: userData.created_at!,
        phone: userData.phone!,
      };
      setUserData(translatedUserData);
    } catch (error) {
      console.error("Failed to fetch user data:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkUserIsLoggedIn = async (callback?: () => void): Promise<void> => {
    // Check for existing session
    const { data } = await supabase.auth.getSession();
    if (data.session) {
      setSession(data.session);
      await fetchUserData();
      if (typeof callback === "function") callback();
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkUserIsLoggedIn();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const value: AuthContextType = {
    user,
    userData,
    loading,
    authError,
    authSuccess,
    session,
    // Auth methods
    signup,
    login,
    logout,
    resetPassword,
    updateUserProfile,
    sendVerificationEmail,
    confirmPasswordReset,
    checkUserIsLoggedIn,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
