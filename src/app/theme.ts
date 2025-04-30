import { createTheme } from "@mui/material";

// Create a custom theme with your specified color palette
export const theme = createTheme({
  palette: {
    primary: {
      main: "#49b5fe", // Bright Blue
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
    },
    success: {
      main: "#4caf50", // Bright yellow
    },
  },
});
