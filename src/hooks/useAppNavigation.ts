"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface UseAppNavigationReturn {
  // State
  mobileOpen: boolean;

  // Handlers
  handleDrawerToggle: () => void;
  handleNavigation: (path: string) => void;
  handleLogoClick: () => void;
}

export const useAppNavigation = (): UseAppNavigationReturn => {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
    setMobileOpen(false);
  };

  const handleLogoClick = () => {
    router.push("/dashboard");
  };

  return {
    // State
    mobileOpen,

    // Handlers
    handleDrawerToggle,
    handleNavigation,
    handleLogoClick,
  };
};
