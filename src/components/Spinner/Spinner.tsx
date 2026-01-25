"use client";

import { Box, keyframes } from "@mui/material";

const spin = keyframes`
  0% { transform: rotate(0deg) scale(1); }
  100% { transform: rotate(360deg) scale(1); }
`;

export const Spinner = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: "100vw",
        height: "100vh",
      }}
    >
      {/* Logo */}
      <Box
        component="img"
        src="/inriLogo.png"
        alt="INRI Paint & Wall Logo"
        sx={{
          width: 250,
          height: 250,
          animation: `${spin} 6s linear infinite`,
        }}
      />
    </Box>
  );
};

export default Spinner;
