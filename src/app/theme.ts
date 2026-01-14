import { createTheme } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    gradient: {
      subtle: string;
      colorful: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      subtle?: string;
      colorful?: string;
    };
  }
}

// Create a custom theme with your specified color palette
export const theme = createTheme({
  typography: {
    fontFamily: "Roboto, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 700,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 600,
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: 500,
    },
    body1: {
      fontSize: "1rem",
      lineHeight: 1.5,
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.4,
    },
  },
  palette: {
    primary: {
      light: "#e1ebffff", // Deep Blue
      main: "#3b82f6", // Bright Blue
      contrastText: "#fff", // Black text for contrast
    },
    gradient: {
      subtle: "linear-gradient(to right, #0554e7ff, #3b82f6)",
      colorful: "radial-gradient(circle, #3b82f6, #0554e7ff)",
    },
    secondary: {
      light: "#ffe8deff", // Soft Orange
      main: "#ff3131", // Bold Red
    },
    background: {
      default: "#ffffff", // White background
    },
    text: {
      primary: "#000000", // Black text
    },
    // Adding custom colors as additional palette fields.
    info: {
      light: "#e8f7faff", // Soft blue-green
      main: "#c7ebf2", // Soft blue-green
    },
    warning: {
      light: "#fff7e2ff", // Light yellow-orange
      main: "#f7bd59", // Warm yellow-orange
      contrastText: "#fff", // Black text for contrast
    },
    success: {
      light: "#f4fff3ff", // Medium green
      main: "#4caf50", // Bright yellow
    },
    error: {
      light: "#ffbfbfff", // Medium green
      main: "#e62525ff", // Bright yellow
    },
  },
  components: {
    // all input fields from have white background
    MuiInputBase: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: "#f9f9f9", // Light grey background for Paper components
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          cursor: "pointer",
          textTransform: "uppercase",
          borderRadius: "20px", // Add rounded corners
          padding: "8px 16px", // Add padding for better touch targets
          fontWeight: "bold", // Make button text bold
        },
      },
    },
  },
});
