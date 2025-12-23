"use client";

import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";

type ScreenSize = "xs" | "sm" | "md" | "lg" | "xl";

interface UseScreenSizeReturn {
  screenSize: ScreenSize;
  width: number;
  isXs: boolean;
  isSm: boolean;
  isMd: boolean;
  isLg: boolean;
  isXl: boolean;
  isSmUp: boolean;
  isMdUp: boolean;
  isLgUp: boolean;
  isXlUp: boolean;
  isSmDown: boolean;
  isMdDown: boolean;
  isLgDown: boolean;
}

export const useScreenSize = (): UseScreenSizeReturn => {
  const theme = useTheme();
  const [width, setWidth] = useState<number>(0);
  const [screenSize, setScreenSize] = useState<ScreenSize>("xs");

  useEffect(() => {
    // Function to get current window width
    const getWidth = () => {
      if (typeof window !== "undefined") {
        return window.innerWidth;
      }
      return 0;
    };

    // Function to determine screen size based on Material-UI breakpoints
    const getScreenSize = (width: number): ScreenSize => {
      const breakpoints = theme.breakpoints.values;

      if (width >= breakpoints.xl) return "xl";
      if (width >= breakpoints.lg) return "lg";
      if (width >= breakpoints.md) return "md";
      if (width >= breakpoints.sm) return "sm";
      return "xs";
    };

    // Set initial values
    const initialWidth = getWidth();
    setWidth(initialWidth);
    setScreenSize(getScreenSize(initialWidth));

    // Handle window resize
    const handleResize = () => {
      const newWidth = getWidth();
      setWidth(newWidth);
      setScreenSize(getScreenSize(newWidth));
    };

    // Add event listener
    if (typeof window !== "undefined") {
      window.addEventListener("resize", handleResize);
    }

    // Cleanup
    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", handleResize);
      }
    };
  }, [theme.breakpoints.values]);

  // Helper boolean values for convenience
  const isXs = screenSize === "xs";
  const isSm = screenSize === "sm";
  const isMd = screenSize === "md";
  const isLg = screenSize === "lg";
  const isXl = screenSize === "xl";

  // "Up" breakpoints - current size and larger
  const isSmUp = screenSize !== "xs";
  const isMdUp = ["md", "lg", "xl"].includes(screenSize);
  const isLgUp = ["lg", "xl"].includes(screenSize);
  const isXlUp = screenSize === "xl";

  // "Down" breakpoints - current size and smaller
  const isSmDown = ["xs", "sm"].includes(screenSize);
  const isMdDown = ["xs", "sm", "md"].includes(screenSize);
  const isLgDown = ["xs", "sm", "md", "lg"].includes(screenSize);

  return {
    screenSize,
    width,
    isXs,
    isSm,
    isMd,
    isLg,
    isXl,
    isSmUp,
    isMdUp,
    isLgUp,
    isXlUp,
    isSmDown,
    isMdDown,
    isLgDown,
  };
};
