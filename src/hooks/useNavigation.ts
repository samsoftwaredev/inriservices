import { useState } from "react";
import { useRouter } from "next/navigation";

export const useNavigation = () => {
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

  const closeMobileDrawer = () => {
    setMobileOpen(false);
  };

  return {
    // State
    mobileOpen,
    setMobileOpen,

    // Handlers
    handleDrawerToggle,
    handleNavigation,
    handleLogoClick,
    closeMobileDrawer,
  };
};
