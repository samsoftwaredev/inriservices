import { createTheme } from "@mui/material";

// Create a custom theme with your specified color palette
export const theme = createTheme({
  palette: {
    primary: {
      main: "#49b5fe", // Bright Blue
      contrastText: "#fff", // Black text for contrast
    },
    secondary: {
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
      main: "#c7ebf2", // Soft blue-green
    },
    warning: {
      main: "#f7bd59", // Warm yellow-orange
      contrastText: "#fff", // Black text for contrast
    },
    success: {
      main: "#4caf50", // Bright yellow
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          cursor: "pointer",
          textTransform: "uppercase",
          borderRadius: "8px", // Add rounded corners
          padding: "8px 16px", // Add padding for better touch targets
          fontWeight: "bold", // Make button text bold
        },
      },
    },
  },
});
